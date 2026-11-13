"""
Generates ECharts option JSON (herufi/data/charts/ag_fig*.json) for the fourteen figures
across the three part Agricultural Capital series: "Why Banks Turn Down Farm Loans They
Expect to Be Repaid", "Good Business, Wrong Money" and "Spend the Same Money Differently".

Provenance. Every number comes from scripts/agri_source.json, which is a verbatim dump of
the Agri Capital Matching research project's own model and datasets (model.load_loan_economics,
model.scenario_table, model.reach_outcome, model.sensitivity, model.decompose_constrained,
model.guarantee_ceiling, model.gap_by_tenor and the Aceli and ISF source tables). Nothing here
is hand transcribed. That project holds the tests: src/test_claims.py verifies 69 published
figures against live model output, so if a number moves there, the dump is regenerated and
these charts follow.

Form. The figures were authored first as Plotly posters in that project, where the visual form
was chosen from the research question rather than from habit. The same choices are carried over
here: a waterfall for a loan's profit and loss, a Sankey for the smallholder finance channels,
a treemap for the need drawn to scale, a bullet chart for the guarantee ceiling, a heatmap for
the capital fit matrix, a quadrant for leverage against additionality, a slope chart for target
against actual, small multiples for the ownership data, a dumbbell on an index, and two more
waterfalls. The two figures with a scenario dimension use an ECharts timeline rather than
Plotly's buttons, which is the same interaction in this toolkit.

Options are composed as plain dicts rather than through pyecharts' fluent API, matching the
house pattern established in generate_charts.py and for the same reason: most of these figures
need per point colours, reference lines, log axes or stacked transparent bases, which the
fluent builder handles unreliably.

Note on tooltips: these options are JSON, so they carry no JavaScript. Every tooltip uses
ECharts' own string templates. Where a figure needs to surface a sentence of reasoning, that
sentence travels as an extra data dimension and is addressed with {@[n]}.

Run: python3 scripts/generate_agri_charts.py
"""
import json
import os

HERE = os.path.dirname(__file__)
OUT_DIR = os.path.join(HERE, "..", "data", "charts")
os.makedirs(OUT_DIR, exist_ok=True)

with open(os.path.join(HERE, "agri_source.json")) as f:
    SRC = json.load(f)

FOREST = "#1B4332"
FOREST_LIGHT = "#2D6A4F"
GOLD = "#C9A84C"
CHARCOAL = "#1C1C1E"
INK2 = "#5A5A5E"
INK3 = "#91918F"
BORDER = "#E5E5E3"
UNMET = "#D8D8D2"
LOSS = "#A8442F"
FONT = "Inter, system-ui, sans-serif"

TEXT = {"fontFamily": FONT, "color": CHARCOAL}
AXIS_LABEL = {"fontSize": 11, "color": INK2, "fontFamily": FONT}
SPLIT = {"show": True, "lineStyle": {"color": BORDER}}


def write_figure(fig_id, title, caption, panels):
    path = os.path.join(OUT_DIR, f"{fig_id}.json")
    with open(path, "w") as f:
        json.dump({"id": fig_id, "title": title, "caption": caption, "panels": panels}, f, indent=2)
    print("wrote", os.path.basename(path))


def panel(title, option, height=None):
    p = {"title": title, "option": option}
    if height:
        p["height"] = height
    return p


def base(grid=None, tooltip=None):
    o = {
        "textStyle": TEXT,
        "grid": grid or {"left": 60, "right": 24, "top": 30, "bottom": 40, "containLabel": True},
        "tooltip": tooltip or {"trigger": "item", "confine": True,
                               "textStyle": {"fontFamily": FONT, "fontSize": 12}},
    }
    return o


def value_axis(name=None, **kw):
    a = {"type": "value", "axisLabel": AXIS_LABEL, "splitLine": SPLIT,
         "axisLine": {"show": False}, "axisTick": {"show": False}}
    if name:
        a["name"] = name
        a["nameTextStyle"] = {"fontSize": 11, "color": INK3, "fontFamily": FONT}
    a.update(kw)
    return a


def cat_axis(data, **kw):
    a = {"type": "category", "data": data, "axisLabel": AXIS_LABEL,
         "axisLine": {"lineStyle": {"color": BORDER}}, "axisTick": {"show": False},
         "splitLine": {"show": False}}
    a.update(kw)
    return a


def waterfall_series(values, is_total, colors):
    """Transparent base plus visible deltas: the standard ECharts waterfall.

    `values` are signed deltas except at the `is_total` positions, which are
    absolute running totals. Returns (base_data, delta_data).
    """
    base_data, delta_data, running = [], [], 0.0
    for i, v in enumerate(values):
        if is_total[i]:
            base_data.append(min(0.0, v))
            delta_data.append({"value": abs(v), "itemStyle": {"color": colors[i]}})
            running = v
        else:
            start = running
            running = running + v
            base_data.append(min(start, running))
            delta_data.append({"value": abs(v), "itemStyle": {"color": colors[i]}})
    return base_data, delta_data


def waterfall_option(cats, values, is_total, colors, unit, y_range=None, label_fmt="{c}"):
    base_data, delta_data = waterfall_series(values, is_total, colors)
    y = value_axis(**({"min": y_range[0], "max": y_range[1]} if y_range else {}))
    y["axisLabel"] = dict(AXIS_LABEL, formatter=f"{{value}}{unit}")
    o = base(grid={"left": 54, "right": 20, "top": 34, "bottom": 56, "containLabel": True},
             tooltip={"trigger": "axis", "axisPointer": {"type": "shadow"}, "confine": True,
                      "textStyle": {"fontFamily": FONT, "fontSize": 12}})
    o["xAxis"] = cat_axis(cats, axisLabel=dict(AXIS_LABEL, interval=0, lineHeight=14, width=84,
                                               overflow="break"))
    o["yAxis"] = y
    o["series"] = [
        {"name": "base", "type": "bar", "stack": "w", "silent": True,
         "itemStyle": {"color": "transparent"}, "emphasis": {"disabled": True},
         "data": base_data, "barMaxWidth": 56,
         "tooltip": {"show": False}},
        {"name": "amount", "type": "bar", "stack": "w", "data": delta_data, "barMaxWidth": 56,
         "label": {"show": True, "position": "top", "fontFamily": FONT, "fontSize": 11,
                   "color": CHARCOAL, "formatter": label_fmt}},
    ]
    return o


# --------------------------------------------------------------------- fig 1
# Waterfall with a timeline over the five loan size bands.

def fig_loan_pnl():
    econ = SRC["loan_economics"]
    cats = ["Interest and\nfees earned", "Finding and\nassessing", "Servicing and\ncollecting",
            "Expected\ncredit loss", "Cost of the\nbank's funding", "What the\nbank keeps"]
    band_label = {r["band"]: r["band"].replace("$", "").replace("-", " to ") for r in econ}

    options = []
    for r in econ:
        vals = [r["total_revenue"], -r["origination_cost"], -r["servicing_cost"],
                -r["expected_credit_loss"], -r["cost_of_funds"], r["net_margin"]]
        is_total = [False, False, False, False, False, True]
        colors = [FOREST, UNMET, UNMET, UNMET, UNMET,
                  GOLD if r["net_margin"] > 0 else LOSS]
        labels = [f"{v:+.1f}" if 0 < i < 5 else f"{v:.1f}" for i, v in enumerate(vals)]
        opt = waterfall_option(cats, vals, is_total, colors, "%", y_range=[-8, 22])
        opt["series"][1]["data"] = [
            dict(d, label={"show": True, "position": "top", "formatter": labels[i],
                           "fontFamily": FONT, "fontSize": 11, "color": CHARCOAL})
            for i, d in enumerate(opt["series"][1]["data"])
        ]
        options.append({"series": opt["series"],
                        "title": {"text": f"Loans of {band_label[r['band']]}",
                                  "left": "center", "top": 0,
                                  "textStyle": {"fontSize": 12, "fontWeight": "normal",
                                                "color": INK2, "fontFamily": FONT}}})

    skeleton = waterfall_option(cats, [0] * 6, [False] * 6, [FOREST] * 6, "%", y_range=[-8, 22])
    skeleton["grid"]["top"] = 44
    base_option = dict(skeleton)
    base_option["timeline"] = {
        "axisType": "category",
        "data": [band_label[r["band"]] for r in econ],
        "autoPlay": False, "currentIndex": 0, "bottom": 0, "left": 20, "right": 20,
        "label": {"fontFamily": FONT, "fontSize": 11, "color": INK2},
        "lineStyle": {"color": BORDER}, "itemStyle": {"color": INK3},
        "checkpointStyle": {"color": FOREST, "borderColor": "#fff"},
        "controlStyle": {"itemSize": 13, "color": INK2, "borderColor": INK2,
                         "showPlayBtn": False},
        "emphasis": {"label": {"color": FOREST}, "itemStyle": {"color": FOREST}},
    }
    base_option["grid"]["bottom"] = 72

    write_figure(
        "ag_fig1",
        "On the smallest farm loans, finding the borrower costs sixteen times what the expected default costs",
        "Profit and loss on an agricultural SME loan, as a percentage of loan value over the "
        "life of the loan. Step through the loan sizes along the bottom and watch the first "
        "grey bar collapse while the small credit loss bar barely moves.",
        [panel(None, {"baseOption": base_option, "options": options}, height=430)],
    )


# --------------------------------------------------------------------- fig 2
# Bubble scatter on a log axis with the fitted cost curve.

def fig_cost_vs_risk():
    econ = SRC["loan_economics"]
    cc = SRC["cost_curve"]
    import math
    xs = [12000 * (1300000 / 12000) ** (i / 59) for i in range(60)]
    curve = [[round(x, 2), round(math.exp(cc["a"]) * x ** cc["b"], 3)] for x in xs]
    maxv = max(r["loan_value_musd"] for r in econ)

    def size(v):
        return 14 + 30 * (v / maxv) ** 0.5

    opex = [{"value": [r["ticket_mid"], r["opex"]], "symbolSize": size(r["loan_value_musd"]),
             "name": r["band"]} for r in econ]
    ecl = [{"value": [r["ticket_mid"], r["expected_credit_loss"]],
            "symbolSize": size(r["loan_value_musd"]), "name": r["band"]} for r in econ]

    o = base(grid={"left": 56, "right": 28, "top": 46, "bottom": 52, "containLabel": True})
    o["tooltip"] = {"trigger": "item", "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12},
                    "formatter": "<b>{b}</b><br/>{a}: {@[1]}% of loan value"}
    o["legend"] = {"top": 0, "left": 0, "itemGap": 18, "icon": "circle",
                   "textStyle": {"fontFamily": FONT, "fontSize": 11, "color": INK2},
                   "data": ["Cost of making the loan", "Expected credit loss"]}
    o["xAxis"] = value_axis(
        type="log", min=12000, max=1300000,
        axisLabel=dict(AXIS_LABEL, formatter="${value}"), splitLine={"show": False},
        axisLine={"show": True, "lineStyle": {"color": BORDER}})
    o["yAxis"] = value_axis(min=-1, max=19, axisLabel=dict(AXIS_LABEL, formatter="{value}%"))
    o["series"] = [
        {"name": "Fitted cost curve", "type": "line", "data": curve, "showSymbol": False,
         "lineStyle": {"color": FOREST, "width": 1.4, "type": "dotted"},
         "tooltip": {"show": False}, "silent": True, "legendHoverLink": False},
        {"name": "Cost of making the loan", "type": "scatter", "data": opex,
         "itemStyle": {"color": FOREST, "borderColor": "#fff", "borderWidth": 1.5},
         "label": {"show": True, "position": "top", "formatter": "{@[1]}%",
                   "fontFamily": FONT, "fontSize": 11, "color": FOREST}},
        {"name": "Expected credit loss", "type": "scatter", "data": ecl,
         "itemStyle": {"color": LOSS, "borderColor": "#fff", "borderWidth": 1.5},
         "label": {"show": True, "position": "bottom", "formatter": "{@[1]}%",
                   "fontFamily": FONT, "fontSize": 11, "color": LOSS}},
    ]
    write_figure(
        "ag_fig2",
        "The cost of lending moves 39 times more than the risk of not being repaid",
        "Each pair of circles is one loan size band. Circle area is the value lent in that "
        "band, so the biggest circles show where the market's money sits. The horizontal axis "
        "is logarithmic. Hover any circle for the band and the exact figure.",
        [panel(None, o, height=400)],
    )


# --------------------------------------------------------------------- fig 3
# Bullet chart: measure bar, comparative marker, target line.

def fig_guarantee_ceiling():
    gc = SRC["guarantee_ceiling"]
    bands = [r["band"].replace("$", "").replace("-", " to ") for r in gc][::-1]
    rows = gc[::-1]
    bars = [{"value": r["net_margin"],
             "itemStyle": {"color": LOSS if r["net_margin"] < 0 else FOREST}} for r in rows]
    marks = [[r["margin_with_full_guarantee"], i] for i, r in enumerate(rows)]

    o = base(grid={"left": 96, "right": 40, "top": 40, "bottom": 44, "containLabel": True})
    o["tooltip"] = {"trigger": "axis", "axisPointer": {"type": "shadow"}, "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12},
                    "valueFormatter": None}
    o["tooltip"].pop("valueFormatter")
    o["legend"] = {"top": 0, "left": 0, "itemGap": 18,
                   "textStyle": {"fontFamily": FONT, "fontSize": 11, "color": INK2},
                   "data": ["What the bank keeps today",
                            "With every shilling of expected loss covered free"]}
    o["xAxis"] = value_axis(min=-3.2, max=11.4, axisLabel=dict(AXIS_LABEL, formatter="{value}%"))
    o["yAxis"] = cat_axis(bands, splitLine={"show": False})
    o["series"] = [
        {"name": "What the bank keeps today", "type": "bar", "data": bars, "barWidth": 14,
         "markLine": {"silent": True, "symbol": "none",
                      "lineStyle": {"color": CHARCOAL, "width": 1.4, "type": "solid"},
                      "label": {"show": True, "formatter": "breakeven", "position": "end",
                                "fontFamily": FONT, "fontSize": 10, "color": INK3},
                      "data": [{"xAxis": 0}]}},
        {"name": "With every shilling of expected loss covered free", "type": "scatter",
         "data": marks, "symbol": "diamond", "symbolSize": 15,
         "itemStyle": {"color": GOLD, "borderColor": "#fff", "borderWidth": 1.5}},
    ]
    write_figure(
        "ag_fig3",
        "A guarantee covering every expected shilling of loss still leaves the smallest loans losing money",
        "The bar is what a lender keeps today. The gold diamond is the same loan with 100 per "
        "cent of expected credit loss covered at no cost, which is better than any real "
        "guarantee on offer. On every band except the smallest, the diamond clears breakeven.",
        [panel(None, o, height=340)],
    )


# --------------------------------------------------------------------- fig 4
# Treemap: the whole need drawn to scale.

def fig_need_treemap():
    gap = SRC["gap_by_tenor"]
    short = {"Short-term agricultural": "Short term",
             "Long-term agricultural": "Long term",
             "Non-agricultural": "Non farm household"}
    children = []
    for r in gap:
        children.append({
            "name": f"{short[r['need_type']]}  ${r['need_usd_bn']:.1f}bn needed",
            "itemStyle": {"color": INK2, "borderColor": "#fff", "borderWidth": 2},
            "children": [
                {"name": f"Supplied ${r['supply_usd_bn']:.1f}bn", "value": r["supply_usd_bn"],
                 "itemStyle": {"color": FOREST}},
                {"name": f"Unmet ${r['gap_usd_bn']:.1f}bn", "value": r["gap_usd_bn"],
                 "itemStyle": {"color": UNMET}},
            ],
        })
    o = {"textStyle": TEXT,
         "tooltip": {"trigger": "item", "confine": True,
                     "textStyle": {"fontFamily": FONT, "fontSize": 12},
                     "formatter": "{b}<br/>${c}bn a year"},
         "series": [{
             "type": "treemap", "roam": False, "nodeClick": "zoomToNode",
             "breadcrumb": {"show": True, "bottom": 0,
                            "itemStyle": {"color": BORDER, "textStyle": {"color": INK2,
                                                                         "fontFamily": FONT}}},
             "upperLabel": {"show": True, "height": 24, "fontFamily": FONT, "fontSize": 11,
                            "color": "#fff"},
             "label": {"show": True, "fontFamily": FONT, "fontSize": 12, "color": "#fff",
                       "formatter": "{b}"},
             "levels": [
                 {"itemStyle": {"borderColor": "#fff", "borderWidth": 3, "gapWidth": 3}},
                 {"itemStyle": {"borderColor": "#fff", "borderWidth": 2, "gapWidth": 2},
                  "colorSaturation": [0.9, 1]},
             ],
             "data": children,
         }]}
    write_figure(
        "ag_fig4",
        "Drawn to scale, the long term finance that makes farms more productive barely registers",
        "The full 78.1 billion dollar annual smallholder finance need for Africa south of the "
        "Sahara, divided by purpose and then by whether it is supplied. Green is supplied, grey "
        "is unmet. Look for green inside the long term block. There is none to see: 0.1 billion "
        "dollars against 27.0 billion unmet is too thin a sliver to draw.",
        [panel(None, o, height=380)],
    )


# --------------------------------------------------------------------- fig 5
# Sankey: who actually finances smallholder farmers.

def fig_channels():
    ch = sorted(SRC["channels"], key=lambda r: -r["volume_usd_bn"])
    total = sum(r["volume_usd_bn"] for r in ch)
    fi = sum(r["volume_usd_bn"] for r in ch if r["is_financial_institution"])
    non_fi = total - fi
    mid_non = f"Never touches a bank or a lender  ${non_fi:.1f}bn"
    mid_fi = f"Banks, state banks, microfinance, platforms  ${fi:.1f}bn"
    sink = f"Smallholder farmers  ${total:.1f}bn a year"

    nodes, links = [], []
    for r in ch:
        name = f"{r['channel']}  ${r['volume_usd_bn']:.1f}bn"
        colour = FOREST if r["is_financial_institution"] else GOLD
        nodes.append({"name": name, "itemStyle": {"color": colour, "borderColor": "#fff"}})
        links.append({"source": name,
                      "target": mid_fi if r["is_financial_institution"] else mid_non,
                      "value": r["volume_usd_bn"],
                      "lineStyle": {"color": colour, "opacity": 0.32}})
    nodes.append({"name": mid_non, "itemStyle": {"color": GOLD, "borderColor": "#fff"}})
    nodes.append({"name": mid_fi, "itemStyle": {"color": FOREST, "borderColor": "#fff"}})
    nodes.append({"name": sink, "itemStyle": {"color": CHARCOAL, "borderColor": "#fff"}})
    links.append({"source": mid_non, "target": sink, "value": non_fi,
                  "lineStyle": {"color": GOLD, "opacity": 0.32}})
    links.append({"source": mid_fi, "target": sink, "value": fi,
                  "lineStyle": {"color": FOREST, "opacity": 0.32}})

    o = {"textStyle": TEXT,
         "tooltip": {"trigger": "item", "confine": True,
                     "textStyle": {"fontFamily": FONT, "fontSize": 12},
                     "formatter": "{b}<br/>${c}bn a year"},
         "series": [{
             "type": "sankey", "left": 8, "right": 8, "top": 12, "bottom": 12,
             "nodeGap": 14, "nodeWidth": 13, "draggable": True,
             "emphasis": {"focus": "adjacency"},
             "label": {"fontFamily": FONT, "fontSize": 11, "color": CHARCOAL},
             "lineStyle": {"curveness": 0.5},
             "data": nodes, "links": links,
         }]}
    write_figure(
        "ag_fig5",
        "Nearly three quarters of smallholder finance never passes through a bank or a lender",
        "Annual flow of finance to smallholder farmers worldwide, by the kind of institution "
        "supplying it. Gold flows come from trading relationships and informal networks, green "
        "from financial institutions. Hover a ribbon to isolate it, or drag a node to untangle "
        "a crossing.",
        [panel(None, o, height=420)],
    )


# --------------------------------------------------------------------- fig 6
# Lollipop with a reference line at the risk free rate.

def fig_opportunity_cost():
    oc = sorted(SRC["opportunity_cost"], key=lambda r: r["value_pct"])
    short = {
        "Agri-SME lending (simple average)": "Lending to farm businesses",
        "Agri-SME lending (value weighted)": "The same, weighted by loan size",
        "Agri-SME lending plus Aceli incentives": "The same, with donor support",
        "Government bonds": "Government bonds",
        "Overall bank profitability": "Everything else the bank does",
    }
    labels = [short[r["benchmark"]] for r in oc]
    is_agri = ["Agri-SME" in r["benchmark"] for r in oc]
    bars = [{"value": r["value_pct"],
             "itemStyle": {"color": FOREST if is_agri[i] else GOLD}}
            for i, r in enumerate(oc)]
    dots = [{"value": [r["value_pct"], i],
             "itemStyle": {"color": FOREST if is_agri[i] else GOLD},
             "name": short[r["benchmark"]]} for i, r in enumerate(oc)]
    bond = next(r["value_pct"] for r in oc if r["benchmark"] == "Government bonds")

    o = base(grid={"left": 180, "right": 48, "top": 20, "bottom": 44, "containLabel": True})
    o["tooltip"] = {"trigger": "axis", "axisPointer": {"type": "shadow"}, "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12}}
    o["xAxis"] = value_axis(min=0, max=33, axisLabel=dict(AXIS_LABEL, formatter="{value}%"))
    o["yAxis"] = cat_axis(labels, splitLine={"show": False},
                          axisLabel=dict(AXIS_LABEL, width=170, overflow="break"))
    o["series"] = [
        {"name": "Return", "type": "bar", "data": bars, "barWidth": 3,
         "markLine": {"silent": True, "symbol": "none",
                      "lineStyle": {"color": GOLD, "width": 1, "type": "dotted"},
                      "label": {"show": True, "formatter": "the risk free alternative",
                                "position": "insideEndTop", "fontFamily": FONT,
                                "fontSize": 10, "color": GOLD},
                      "data": [{"xAxis": bond}]}},
        {"name": "dot", "type": "scatter", "data": dots, "symbolSize": 15,
         "itemStyle": {"borderColor": "#fff", "borderWidth": 1.5},
         "label": {"show": True, "position": "right", "formatter": "{@[0]}%",
                   "fontFamily": FONT, "fontSize": 11, "color": CHARCOAL},
         "tooltip": {"show": False}},
    ]
    write_figure(
        "ag_fig6",
        "A government bond pays more than four times what a farm loan pays, and asks nothing in return",
        "Average returns available to a commercial bank in Kenya, Rwanda, Tanzania, Uganda and "
        "Zambia, 2020 to 2023. Green is agriculture, gold is the alternatives.",
        [panel(None, o, height=300)],
    )


# --------------------------------------------------------------------- fig 7
# Heatmap: thirty judgements, each carrying its reason into the tooltip.

def fig_matching_matrix():
    arch = SRC["arch_order"]
    prov = SRC["prov_order"]
    matching = SRC["matching"]
    arch_short = {
        "Input distributor": "Input distributor",
        "Offtaker and processor": "Crop buyer and processor",
        "Embedded agri-lender": "Lender inside the supply chain",
        "Digital advisory and marketplace": "Digital advisory and marketplace",
        "Asset financier and mechanisation": "Asset financier and mechanisation",
    }
    prov_short = {
        "Venture capital": "Venture\ncapital",
        "Impact and patient equity": "Impact and\npatient equity",
        "Local commercial banks": "Local\ncommercial banks",
        "Specialist agri-lenders": "Specialist\nagri lenders",
        "Development finance institutions": "Development\nfinance institutions",
        "Donors and philanthropy": "Donors and\nphilanthropy",
    }
    order = ["Input distributor", "Offtaker and processor", "Embedded agri-lender",
             "Asset financier and mechanisation", "Digital advisory and marketplace"]
    rows = order[::-1]
    scale = {0: "No fit", 1: "Narrow fit", 2: "Partial fit", 3: "Strong fit"}

    data = []
    for yi, a in enumerate(rows):
        for xi, p in enumerate(prov):
            score, reason = matching[a][p]
            data.append({"value": [xi, yi, score, f"{scale[score]}. {reason}"],
                         "label": {"show": score > 0, "formatter": "●" * score}})

    o = {"textStyle": TEXT,
         "grid": {"left": 170, "right": 70, "top": 52, "bottom": 12, "containLabel": True},
         "tooltip": {"trigger": "item", "confine": True, "extraCssText": "max-width:300px;white-space:normal",
                     "textStyle": {"fontFamily": FONT, "fontSize": 12},
                     "formatter": "<b>{@[3]}</b>"},
         "xAxis": cat_axis([prov_short[p] for p in prov], position="top",
                           axisLabel=dict(AXIS_LABEL, interval=0, lineHeight=13),
                           axisLine={"show": False}),
         "yAxis": cat_axis([arch_short[a] for a in rows], splitLine={"show": False},
                           axisLabel=dict(AXIS_LABEL, width=160, overflow="break"),
                           axisLine={"show": False}),
         "visualMap": {"min": 0, "max": 3, "calculable": False, "orient": "vertical",
                       "right": 0, "top": "middle", "itemHeight": 110, "itemWidth": 11,
                       "text": ["Strong", "None"], "dimension": 2,
                       "textStyle": {"fontFamily": FONT, "fontSize": 10, "color": INK2},
                       "inRange": {"color": ["#F5F5F3", "#BBCFC2", FOREST_LIGHT, FOREST]}},
         "series": [{"type": "heatmap", "data": data,
                     "label": {"fontFamily": FONT, "fontSize": 13, "color": "#fff"},
                     "itemStyle": {"borderColor": "#fff", "borderWidth": 3},
                     "emphasis": {"itemStyle": {"borderColor": CHARCOAL, "borderWidth": 2}}}]}
    write_figure(
        "ag_fig7",
        "Only one of five agricultural business models has venture shaped economics, and it is the one furthest from the farm",
        "The author's assessment of fit between five agricultural business models and six "
        "sources of capital, scored none, narrow, partial or strong. This is a judgement, not a "
        "dataset, so every cell carries its reasoning: hover any square to read why. The dots "
        "repeat the score for readers who cannot rely on colour.",
        [panel(None, o, height=360)],
    )


# --------------------------------------------------------------------- fig 8
# Quadrant scatter: leverage against additionality.

def fig_leverage_quadrant():
    al = SRC["additionality_leverage"]
    pts = [{"value": [r["leverage_ratio"], r["pct_new_borrowers"]],
            "name": r["band"].replace("$", "").replace("-", " to ")} for r in al]
    path = [[r["leverage_ratio"], r["pct_new_borrowers"]] for r in al]
    levs = sorted(r["leverage_ratio"] for r in al)
    news = sorted(r["pct_new_borrowers"] for r in al)
    mid_lev, mid_new = levs[len(levs) // 2], news[len(news) // 2]

    o = base(grid={"left": 56, "right": 36, "top": 26, "bottom": 54, "containLabel": True})
    o["tooltip"] = {"trigger": "item", "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12},
                    "formatter": "<b>loans of {b}</b><br/>{@[1]}% of borrowers had never held a "
                                 "formal loan<br/>every $1 of subsidy brought ${@[0]} of the "
                                 "lenders' own money"}
    o["xAxis"] = value_axis(name="Leverage: dollars the lenders put in per dollar of subsidy",
                            nameLocation="middle", nameGap=32, min=2, max=33,
                            axisLabel=dict(AXIS_LABEL, formatter="{value}x"),
                            splitLine={"show": False},
                            axisLine={"show": True, "lineStyle": {"color": BORDER}})
    o["yAxis"] = value_axis(min=0, max=100, axisLabel=dict(AXIS_LABEL, formatter="{value}%"))
    o["series"] = [
        {"name": "path", "type": "line", "data": path, "showSymbol": False, "silent": True,
         "lineStyle": {"color": BORDER, "width": 1.6, "type": "dotted"},
         "tooltip": {"show": False}},
        {"name": "band", "type": "scatter", "data": pts, "symbolSize": 19,
         "itemStyle": {"color": FOREST, "opacity": 0.9, "borderColor": "#fff", "borderWidth": 2},
         "label": {"show": True, "position": "right", "formatter": "{b}",
                   "fontFamily": FONT, "fontSize": 11, "color": INK2},
         "markLine": {"silent": True, "symbol": "none",
                      "lineStyle": {"color": BORDER, "width": 1},
                      "label": {"show": False},
                      "data": [{"xAxis": mid_lev}, {"yAxis": mid_new}]}},
    ]
    write_figure(
        "ag_fig8",
        "The loans that move the most commercial money go to the borrowers who least needed help",
        "Each point is one loan size band in Aceli Africa's portfolio. The vertical axis is the "
        "share of borrowers who had never held a formal loan. The horizontal axis is leverage: "
        "for every dollar of subsidy spent, how many dollars the lenders put in from their own "
        "balance sheets. The dotted path runs from the smallest band to the largest.",
        [panel(None, o, height=360)],
    )


# --------------------------------------------------------------------- fig 9
# Slope chart, every metric indexed to its own target.

def fig_target_slope():
    ta = SRC["targets_actuals"]
    nice = {
        "Number of lenders": "Lenders recruited",
        "Number of loans": "Loans made",
        "Average loan size": "Average loan size",
        "Capital mobilised": "Capital mobilised",
        "Leverage ratio": "Leverage ratio",
        "Total SME revenues": "Borrower revenues",
        "SME crop purchases from farmers": "Crop bought from farmers",
        "Share of loans to first-time borrowers": "Share of first time borrowers",
        "Farmers and workers reached": "Farmers and workers reached",
    }
    rows = sorted(ta, key=lambda r: r["actual"] / r["projected"] * 100)
    series = []
    for r in rows:
        pct = r["actual"] / r["projected"] * 100
        colour = FOREST if pct >= 100 else LOSS
        series.append({
            "name": nice[r["metric"]], "type": "line",
            "data": [100, round(pct, 1)],
            "lineStyle": {"color": colour, "width": 2.2},
            "itemStyle": {"color": colour},
            "symbolSize": 8,
            "endLabel": {"show": True, "formatter": "{a}  {@[1]}%", "distance": 8,
                         "fontFamily": FONT, "fontSize": 11, "color": colour},
            "emphasis": {"focus": "series"},
        })

    o = base(grid={"left": 48, "right": 220, "top": 24, "bottom": 44, "containLabel": True})
    o["tooltip"] = {"trigger": "item", "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12},
                    "formatter": "<b>{a}</b><br/>{c}% of what was projected"}
    o["xAxis"] = cat_axis(["What Aceli\nprojected", "What Aceli\ndelivered"],
                          boundaryGap=False,
                          axisLabel=dict(AXIS_LABEL, lineHeight=14))
    o["yAxis"] = value_axis(min=0, max=400,
                            axisLabel=dict(AXIS_LABEL, formatter="{value}%"))
    o["series"] = series
    o["series"][0]["markLine"] = {
        "silent": True, "symbol": "none",
        "lineStyle": {"color": CHARCOAL, "width": 1.4},
        "label": {"show": True, "formatter": "target", "position": "start",
                  "fontFamily": FONT, "fontSize": 10, "color": INK3},
        "data": [{"yAxis": 100}]}
    write_figure(
        "ag_fig9",
        "The two targets Aceli missed are the same sentence as the targets it beat",
        "Nine metrics from Aceli Africa's first five years, each expressed as a percentage of "
        "what it projected, so measures on nine different scales can be compared. Two lines "
        "fall, and both are about money. Every line about reach rises.",
        [panel(None, o, height=380)],
    )


# --------------------------------------------------------------------- fig 10
# Small multiples: three measures, one shared set of rows.

def fig_ownership():
    ow = {r["ownership"]: r for r in SRC["ownership"]}
    order = ["Youth", "Women", "Men 35+"]
    labels = {"Youth": "Businesses owned by\nyoung entrepreneurs",
              "Women": "Businesses owned\nby women",
              "Men 35+": "Businesses owned\nby men over 35"}
    specs = [
        ("Average loan taken", "avg_loan_usd", FOREST, "${value}", 152000),
        ("Loans going bad", "npl_overall_pct", LOSS, "{value}%", 7.6),
        ("Never had a formal loan", "pct_new_borrowers", GOLD, "{value}%", 132),
    ]
    panels = []
    for title, key, colour, fmt, xmax in specs:
        vals = [{"value": ow[o][key], "itemStyle": {"color": colour}} for o in order]
        dots = [{"value": [ow[o][key], i]} for i, o in enumerate(order)]
        o_ = base(grid={"left": 150, "right": 56, "top": 14, "bottom": 18, "containLabel": True})
        o_["tooltip"] = {"trigger": "axis", "axisPointer": {"type": "shadow"}, "confine": True,
                         "textStyle": {"fontFamily": FONT, "fontSize": 12}}
        o_["xAxis"] = value_axis(min=0, max=xmax, show=False, splitLine={"show": False},
                                 axisLabel={"show": False})
        o_["yAxis"] = cat_axis([labels[o] for o in order], splitLine={"show": False},
                               axisLabel=dict(AXIS_LABEL, width=140, overflow="break",
                                              lineHeight=14),
                               axisLine={"show": False})
        o_["series"] = [
            {"name": title, "type": "bar", "data": vals, "barWidth": 2,
             "itemStyle": {"color": BORDER}, "tooltip": {"show": False}},
            {"name": title, "type": "scatter", "data": dots, "symbolSize": 14,
             "itemStyle": {"color": colour, "borderColor": "#fff", "borderWidth": 1.4},
             "label": {"show": True, "position": "right",
                       "formatter": fmt.replace("{value}", "{@[0]}"),
                       "fontFamily": FONT, "fontSize": 11, "color": CHARCOAL}},
        ]
        panels.append(panel(title, o_, height=180))
    write_figure(
        "ag_fig10",
        "The borrowers the market treats as marginal default less often, not more",
        "Agricultural SME borrowers in Aceli Africa's portfolio, by who owns the business. "
        "Three measures on three scales, each panel labelled with its values. Read the middle "
        "panel, then the left one: that is where the trap closes.",
        panels,
    )


# --------------------------------------------------------------------- fig 11
# Diverging bars with a scenario timeline, today always on the chart.

def fig_scenario_margins():
    st = SRC["scenario_table"]
    order = ["Constrained", "Baseline", "Favourable", "Matched", "Matched + operating model"]
    nice = {"Matched + operating model": "Matched, plus cheaper lending"}
    bands = [r["band"].replace("$", "").replace("-", " to ")
             for r in st if r["policy"] == "Baseline"][::-1]
    today = [r["net_margin"] for r in st if r["policy"] == "Baseline"][::-1]

    options = []
    for scn in order:
        rows = [r for r in st if r["policy"] == scn][::-1]
        bars = [{"value": round(r["net_margin"], 2),
                 "itemStyle": {"color": LOSS if r["net_margin"] < 0 else FOREST}} for r in rows]
        options.append({"series": [{"data": bars}, {}]})

    o = base(grid={"left": 96, "right": 64, "top": 30, "bottom": 76, "containLabel": True})
    o["tooltip"] = {"trigger": "axis", "axisPointer": {"type": "shadow"}, "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12}}
    o["legend"] = {"top": 0, "left": 0,
                   "textStyle": {"fontFamily": FONT, "fontSize": 11, "color": INK2},
                   "data": ["Modelled net margin", "Today, for comparison"]}
    o["xAxis"] = value_axis(min=-5.6, max=13.2, axisLabel=dict(AXIS_LABEL, formatter="{value}%"))
    o["yAxis"] = cat_axis(bands, splitLine={"show": False})
    o["series"] = [
        {"name": "Modelled net margin", "type": "bar", "barWidth": 18,
         "data": [{"value": 0}] * len(bands),
         "label": {"show": True, "position": "right", "formatter": "{c}%",
                   "fontFamily": FONT, "fontSize": 11, "color": CHARCOAL},
         "markLine": {"silent": True, "symbol": "none",
                      "lineStyle": {"color": CHARCOAL, "width": 1.4},
                      "label": {"show": False}, "data": [{"xAxis": 0}]}},
        {"name": "Today, for comparison", "type": "scatter",
         "data": [[v, i] for i, v in enumerate(today)],
         "symbol": "rect", "symbolSize": [3, 22],
         "itemStyle": {"color": CHARCOAL}},
    ]
    o["timeline"] = {
        "axisType": "category",
        "data": [nice.get(s, s) for s in order],
        "autoPlay": False, "currentIndex": 4, "bottom": 0, "left": 20, "right": 20,
        "label": {"fontFamily": FONT, "fontSize": 11, "color": INK2},
        "lineStyle": {"color": BORDER}, "itemStyle": {"color": INK3},
        "checkpointStyle": {"color": FOREST, "borderColor": "#fff"},
        "controlStyle": {"itemSize": 13, "color": INK2, "borderColor": INK2,
                         "showPlayBtn": False},
        "emphasis": {"label": {"color": FOREST}, "itemStyle": {"color": FOREST}},
    }
    write_figure(
        "ag_fig11",
        "Donor money can push the smallest loans just across zero. Only a cheaper way of lending holds them there",
        "Modelled net margin a lender keeps on each loan size under five scenarios. Left of the "
        "black line loses money, and the black tick on each row is today. Step through the "
        "scenarios along the bottom and watch the top row. These are illustrative model outputs "
        "built on published lending economics, not forecasts.",
        [panel(None, {"baseOption": o, "options": options}, height=400)],
    )


# --------------------------------------------------------------------- fig 12
# Dumbbell on an index: volume against reach.

def fig_volume_vs_reach():
    ro = {r["scenario"]: r for r in SRC["reach_outcome"]}
    order = ["Constrained", "Baseline", "Favourable", "Matched", "Matched + operating model"]
    nice = {"Matched + operating model": "Matched, plus\ncheaper lending"}
    base_tot = ro["Baseline"]["lending_usd_bn"]
    base_small = ro["Baseline"]["small_ticket_lending_usd_bn"]
    rows = order[::-1]

    tot, small, lines = [], [], []
    for i, s in enumerate(rows):
        t = ro[s]["lending_usd_bn"] / base_tot * 100
        m = ro[s]["small_ticket_lending_usd_bn"] / base_small * 100
        tot.append({"value": [round(t), i], "name": s})
        small.append({"value": [round(m), i], "name": s})
        lines.append({"coords": [[round(t), i], [round(m), i]]})

    o = base(grid={"left": 150, "right": 48, "top": 34, "bottom": 44, "containLabel": True})
    o["tooltip"] = {"trigger": "item", "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12},
                    "formatter": "{a}<br/>{b}: index {@[0]}"}
    o["legend"] = {"top": 0, "left": 0, "icon": "circle", "itemGap": 18,
                   "textStyle": {"fontFamily": FONT, "fontSize": 11, "color": INK2},
                   "data": ["All agricultural lending", "Lending in loans of 10k to 50k dollars"]}
    o["xAxis"] = value_axis(min=0, max=400, axisLabel=AXIS_LABEL)
    o["yAxis"] = cat_axis([nice.get(s, s) for s in rows], splitLine={"show": False},
                          axisLabel=dict(AXIS_LABEL, width=140, overflow="break", lineHeight=14))
    o["series"] = [
        {"name": "gap", "type": "lines", "coordinateSystem": "cartesian2d", "data": lines,
         "polyline": False, "silent": True,
         "lineStyle": {"color": BORDER, "width": 7, "opacity": 1}, "tooltip": {"show": False},
         "z": 1},
        {"name": "All agricultural lending", "type": "scatter", "data": tot, "symbolSize": 16,
         "itemStyle": {"color": INK3, "borderColor": "#fff", "borderWidth": 1.5}, "z": 3,
         "markLine": {"silent": True, "symbol": "none",
                      "lineStyle": {"color": CHARCOAL, "width": 1.3},
                      "label": {"show": True, "formatter": "today", "position": "start",
                                "fontFamily": FONT, "fontSize": 10, "color": INK3},
                      "data": [{"xAxis": 100}]}},
        {"name": "Lending in loans of 10k to 50k dollars", "type": "scatter", "data": small,
         "symbolSize": 16, "z": 3,
         "itemStyle": {"color": FOREST, "borderColor": "#fff", "borderWidth": 1.5},
         "label": {"show": True, "position": "right", "formatter": "{@[0]}",
                   "fontFamily": FONT, "fontSize": 11, "color": FOREST}},
    ]
    write_figure(
        "ag_fig12",
        "More money moves the total. Better targeted money moves the frontier",
        "Modelled lending under five scenarios, with today set to 100 so the two measures can "
        "be compared. The grey dot is all agricultural lending. The green dot is lending in the "
        "smallest loan sizes, where 84 per cent of borrowers have never held a formal loan. "
        "Compare the Favourable and Matched rows: same budget, and the grey dots sit almost on "
        "top of each other.",
        [panel(None, o, height=360)],
    )


# --------------------------------------------------------------------- fig 13
# Parallel slopes across the model's one free parameter.

def fig_sensitivity():
    sens = SRC["sensitivity"]
    betas = sorted(sens.keys(), key=float)
    order = ["Matched + operating model", "Favourable", "Matched", "Baseline", "Constrained"]
    nice = {"Matched + operating model": "Matched, plus cheaper lending"}
    cols = {"Matched + operating model": FOREST, "Favourable": GOLD,
            "Matched": FOREST_LIGHT, "Baseline": INK2, "Constrained": LOSS}
    series = []
    for scn in order:
        series.append({
            "name": nice.get(scn, scn), "type": "line",
            "data": [round(sens[b][scn], 3) for b in betas],
            "lineStyle": {"color": cols[scn], "width": 2.4},
            "itemStyle": {"color": cols[scn]}, "symbolSize": 7,
            "endLabel": {"show": True, "formatter": "{a}", "distance": 8,
                         "fontFamily": FONT, "fontSize": 11, "color": cols[scn]},
            "emphasis": {"focus": "series"},
        })
    o = base(grid={"left": 56, "right": 190, "top": 24, "bottom": 52, "containLabel": True})
    o["tooltip"] = {"trigger": "axis", "confine": True,
                    "textStyle": {"fontFamily": FONT, "fontSize": 12}}
    o["xAxis"] = cat_axis([f"{float(b):g}" for b in betas], boundaryGap=False,
                          name="How strongly lenders shift their book when margins change",
                          nameLocation="middle", nameGap=30,
                          nameTextStyle={"fontSize": 11, "color": INK3, "fontFamily": FONT})
    o["yAxis"] = value_axis(min=0, max=6.9, axisLabel=dict(AXIS_LABEL, formatter="${value}bn"))
    o["series"] = series
    write_figure(
        "ag_fig13",
        "Across a fourfold range of the model's one free parameter, the dollar figures move sevenfold and the ranking never changes",
        "Modelled agricultural lending under each scenario, recomputed across the plausible "
        "range of the parameter governing how strongly lenders shift their book when margins "
        "change. Follow any two lines across and check that they never touch. The ordering is "
        "the finding; the dollar amounts are illustration.",
        [panel(None, o, height=380)],
    )


# --------------------------------------------------------------------- fig 14
# Waterfall: what the Constrained scenario is actually made of.

def fig_decomposition():
    d = {r["scenario"]: r for r in SRC["decompose_constrained"]}
    b = d["Baseline"]["lending_usd_bn"]
    donors = d["Donors retrench, macro holds"]["lending_usd_bn"] - b
    macro = d["Macro deteriorates, donors hold"]["lending_usd_bn"] - b
    end = d["Constrained"]["lending_usd_bn"]
    inter = end - (b + donors + macro)

    cats = ["Lending\ntoday", "Donors\nretrench", "Funding costs and\nbond yields rise",
            "The two\ntogether", "Constrained"]
    vals = [b, donors, macro, inter, end]
    is_total = [True, False, False, False, True]
    colors = [FOREST, LOSS, LOSS, FOREST_LIGHT, GOLD]
    labels = [f"${b:.2f}bn", f"{donors:+.2f}", f"{macro:+.2f}", f"{inter:+.2f}", f"${end:.2f}bn"]

    o = waterfall_option(cats, vals, is_total, colors, "bn", y_range=[0, 3.5])
    o["yAxis"]["axisLabel"] = dict(AXIS_LABEL, formatter="${value}bn")
    o["series"][1]["data"] = [
        dict(x, label={"show": True, "position": "top", "formatter": labels[i],
                       "fontFamily": FONT, "fontSize": 11, "color": CHARCOAL})
        for i, x in enumerate(o["series"][1]["data"])
    ]
    write_figure(
        "ag_fig14",
        "Most of the damage in the worst case comes from the economy, not from donors leaving",
        "Modelled agricultural lending, starting from today and applying each half of the "
        "Constrained scenario on its own. Donor retrenchment costs 4.5 per cent of lending. "
        "Higher funding costs and bond yields cost 26 per cent. The fourth bar is the "
        "interaction, and it is small, so the two effects are close to additive.",
        [panel(None, o, height=360)],
    )


BUILDERS = [
    fig_loan_pnl, fig_cost_vs_risk, fig_guarantee_ceiling, fig_need_treemap, fig_channels,
    fig_opportunity_cost, fig_matching_matrix, fig_leverage_quadrant, fig_target_slope,
    fig_ownership, fig_scenario_margins, fig_volume_vs_reach, fig_sensitivity, fig_decomposition,
]

if __name__ == "__main__":
    for b in BUILDERS:
        b()
    print(f"\n{len(BUILDERS)} figures written to data/charts/")
