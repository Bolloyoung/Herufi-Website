"""
Generates ECharts option JSON (herufi/data/charts/<fig_id>.json) for the 16 figures across
the three African Startup Investment Trilogy publications, from the exact underlying data
extracted from the source Jupyter notebooks in "Research Works/Investment strategies copy/".

Every option dict below conforms exactly to the schema pyecharts.charts.Bar/Line.dump_options()
itself produces (verified interactively against pyecharts 2.1.0) -- dump_options() is pyecharts'
documented mechanism for handing a chart's raw ECharts option to a separate front end. Options
are composed directly rather than through the fluent Bar()/Line() builder because most of these
16 figures need per-point colors, dual reference lines, dual/log axes, or confidence bands, and
pyecharts' fluent API (BarItem per-point styling + reversal_axis() for horizontal bars in
particular) proved unreliable in combination during testing -- reversal_axis() does not
consistently swap the axis "type" field, which silently breaks horizontal category axes.
Composing the dict directly avoids that failure mode while staying schema-identical to
pyecharts' own output. pyecharts remains the pinned toolchain dependency (scripts/requirements.txt).

Run: python3 scripts/generate_charts.py
"""
import json
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "charts")
os.makedirs(OUT_DIR, exist_ok=True)

FOREST = "#1B4332"
FOREST_LIGHT = "#2D6A4F"
GOLD = "#C9A84C"
CHARCOAL = "#1C1C1E"
RED = "#c53030"
RED2 = "#B4453A"
BLUE = "#2b6cb0"
BLUE_LIGHT = "#a0c4e8"
GREEN = "#38a169"
GREY = "#a0aec0"


def write_figure(fig_id, title, caption, panels):
    path = os.path.join(OUT_DIR, f"{fig_id}.json")
    with open(path, "w") as f:
        json.dump({"id": fig_id, "title": title, "caption": caption, "panels": panels}, f, indent=2)
    print("wrote", path)


def panel(title, option, needs_geo_map=False, height=None):
    p = {"title": title, "option": option}
    if needs_geo_map:
        p["needsGeoMap"] = True
    if height:
        p["height"] = height
    return p


# ---------------------------------------------------------------------------
# small option builders (hand-composed ECharts option dicts, matching the
# schema pyecharts' own dump_options() produces)
# ---------------------------------------------------------------------------

def simple_bar_option(categories, series_name, values, y_name=None, subtitle=None,
                       color=FOREST, horizontal=False, rotate_x=0, mark_line=None):
    cat_axis = {"type": "category", "data": categories,
                "axisLabel": {"rotate": rotate_x, "fontSize": 10}}
    val_axis = {"type": "value", "name": y_name,
                "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    series = {"name": series_name, "type": "bar", "data": values, "itemStyle": {"color": color},
              "barMaxWidth": 40}
    if mark_line:
        series["markLine"] = mark_line
    option = {
        "color": [color],
        "tooltip": {"trigger": "axis"},
        "grid": {"left": 56, "right": 20, "top": subtitle and 56 or 36, "bottom": 48, "containLabel": True},
        "series": [series],
    }
    if subtitle:
        option["title"] = {"text": "", "subtext": subtitle, "left": 0, "top": 0,
                            "textStyle": {"fontSize": 1}, "subtextStyle": {"fontSize": 11.5, "color": "#8a8a86"}}
    if horizontal:
        option["xAxis"] = val_axis
        option["yAxis"] = cat_axis
    else:
        option["xAxis"] = cat_axis
        option["yAxis"] = val_axis
    return option


def grouped_bar_option(categories, series_list, y_name=None, colors=None, horizontal=False,
                        rotate_x=0, mark_line=None):
    """series_list: list of (name, values)"""
    colors = colors or [FOREST, GOLD, RED, BLUE]
    cat_axis = {"type": "category", "data": categories, "axisLabel": {"rotate": rotate_x, "fontSize": 10}}
    val_axis = {"type": "value", "name": y_name, "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    series = []
    for i, (name, values) in enumerate(series_list):
        s = {"name": name, "type": "bar", "data": values, "itemStyle": {"color": colors[i % len(colors)]},
             "barMaxWidth": 26}
        if mark_line and i == len(series_list) - 1:
            s["markLine"] = mark_line
        series.append(s)
    option = {
        "color": colors,
        "tooltip": {"trigger": "axis", "axisPointer": {"type": "shadow"}},
        "legend": {"top": 0, "textStyle": {"fontSize": 11}},
        "grid": {"left": 56, "right": 20, "top": 36, "bottom": 48, "containLabel": True},
        "series": series,
    }
    if horizontal:
        option["xAxis"] = val_axis
        option["yAxis"] = cat_axis
    else:
        option["xAxis"] = cat_axis
        option["yAxis"] = val_axis
    return option


def per_point_bar_option(categories, series_name, values, colors, y_name=None, horizontal=False):
    data = [{"value": v, "itemStyle": {"color": c}} for v, c in zip(values, colors)]
    cat_axis = {"type": "category", "data": categories, "axisLabel": {"fontSize": 10}}
    val_axis = {"type": "value", "name": y_name, "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    option = {
        "tooltip": {"trigger": "axis"},
        "grid": {"left": 90, "right": 30, "top": 20, "bottom": 40, "containLabel": True},
        "series": [{"name": series_name, "type": "bar", "data": data, "barMaxWidth": 20}],
    }
    if horizontal:
        option["xAxis"] = val_axis
        option["yAxis"] = cat_axis
    else:
        option["xAxis"] = cat_axis
        option["yAxis"] = val_axis
    return option


def multi_line_option(categories, series_list, y_name=None, log_scale=False, colors=None,
                       dash=None, mark_line=None, area=None):
    """series_list: list of (name, values). dash: set of names to render dashed."""
    colors = colors or [FOREST, RED, GOLD, BLUE, GREEN]
    dash = dash or set()
    area = area or set()
    series = []
    for i, (name, values) in enumerate(series_list):
        s = {
            "name": name, "type": "line", "data": values, "smooth": False,
            "symbolSize": 6, "lineStyle": {"width": 2.4},
            "itemStyle": {"color": colors[i % len(colors)]},
        }
        if name in dash:
            s["lineStyle"]["type"] = "dashed"
        if name in area:
            s["areaStyle"] = {"opacity": 0.08}
        if mark_line and i == 0:
            s["markLine"] = mark_line
        series.append(s)
    val_axis = {"type": "log" if log_scale else "value", "name": y_name,
                "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    return {
        "color": colors,
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 0, "textStyle": {"fontSize": 10}, "type": "scroll"},
        "grid": {"left": 60, "right": 24, "top": 44, "bottom": 44, "containLabel": True},
        "xAxis": {"type": "category", "data": [str(c) for c in categories], "axisLabel": {"fontSize": 10}},
        "yAxis": val_axis,
        "series": series,
    }


def band_series(name, lower, upper, color, dash_name=None, dash_values=None):
    """Confidence-band idiom: invisible lower-bound area stacked with a visible (upper-lower) area."""
    stack_id = f"band-{name}"
    base = [round(v, 4) if v is not None else None for v in lower]
    height = [round(u - l, 4) if (u is not None and l is not None) else None for u, l in zip(upper, lower)]
    series = [
        {"name": f"{name} (lower)", "type": "line", "data": base, "stack": stack_id,
         "symbol": "none", "lineStyle": {"opacity": 0}, "areaStyle": {"opacity": 0},
         "silent": True, "legendHoverLink": False, "tooltip": {"show": False}},
        {"name": name, "type": "line", "data": height, "stack": stack_id,
         "symbol": "none", "lineStyle": {"opacity": 0}, "areaStyle": {"opacity": 0.16, "color": color},
         "itemStyle": {"color": color}, "silent": True},
    ]
    return series


# ---------------------------------------------------------------------------
# R1 -- The Broken Ladder (2014 baseline)
# ---------------------------------------------------------------------------

def r1_fig1():
    years = list(range(2000, 2015))
    vals = [188, 122, 135, 174, 288, 1507, 1994, 2354, 2713, 4092, 4991, 6044, 7129, 8972, 8365]
    colors = [FOREST] * (len(vals) - 1) + [BLUE_LIGHT]
    option = per_point_bar_option([str(y) for y in years], "Companies raising first round", vals, colors,
                                   y_name="Companies")
    option["grid"]["bottom"] = 34
    write_figure(
        "r1_fig1",
        "Global deal flow: companies raising their FIRST round, per year",
        "Companies raising their first funding round per year worldwide, 2000 to 2014. The final year is partial.",
        [panel(None, option)],
    )


def r1_fig2():
    left_cats = ["Africa", "Latin America & Caribbean", "Southeast Asia", "Unknown", "China", "Rest of World", "North America"]
    left_vals = [1.68, 3.15, 3.88, 24.86, 35.58, 103.63, 477.87]
    left_colors = [RED if c == "Africa" else GREY for c in left_cats]
    left = per_point_bar_option(left_cats, "Total disclosed funding ($B)", left_vals, left_colors,
                                 y_name="$ billions", horizontal=True)

    right_cats = ["Unknown", "Africa", "Latin America & Caribbean", "Southeast Asia", "Rest of World", "North America", "China"]
    right_vals = [16.4, 17.0, 24.3, 28.7, 29.4, 40.8, 42.9]
    right_colors = [RED if c == "Africa" else GREY for c in right_cats]
    right = per_point_bar_option(right_cats, "Share raising >1 round (%)", right_vals, right_colors,
                                  y_name="%", horizontal=True)

    write_figure(
        "r1_fig2",
        "Capital concentration and follow on funding by region",
        "Left: total disclosed funding by region (USD billions). Right: share of startups raising more than one round, Africa highlighted.",
        [panel("Total disclosed funding by region (USD billions)", left),
         panel("Share of startups that raise more than one round (%)", right)],
    )


AFRICA_COUNTRIES = [
    ("South Africa", 52, 646717001, -29.0, 25.1),
    ("Egypt", 23, 430439796, 26.8, 30.8),
    ("Kenya", 24, 286115274, 0.0, 37.9),
    ("Nigeria", 29, 275942400, 9.1, 8.7),
    ("Tanzania", 7, 13014000, -6.4, 34.9),
    ("Zimbabwe", 1, 10000000, -19.0, 29.2),
    ("Tunisia", 3, 3970000, 33.9, 9.6),
    ("Uganda", 10, 3964000, 1.4, 32.3),
    ("Morocco", 3, 3200000, 31.8, -7.1),
    ("Botswana", 4, 2271352, -22.3, 24.7),
    ("Somalia", 1, 2000000, 5.2, 46.2),
    ("Ghana", 11, 1774615, 7.9, -1.0),
    ("Algeria", 20, 1216828, 28.0, 1.7),
    ("Cameroon", 2, 119561, 5.7, 12.7),
    ("Côte d'Ivoire", 1, 60000, 7.5, -5.5),
    ("Seychelles", 1, 35000, -4.7, 55.5),
    ("Mozambique", 1, 0, -18.7, 35.5),
]


def r1_fig3():
    max_funding = max(c[2] for c in AFRICA_COUNTRIES)
    data = []
    for name, startups, funding, lat, lon in AFRICA_COUNTRIES:
        radius = 4 + 2.2 * (startups ** 0.5)
        color = RED if (funding / max_funding) > 0.3 else BLUE
        data.append({
            "name": name,
            "value": [lon, lat, startups],
            "symbolSize": round(radius * 2, 1),
            "itemStyle": {"color": color, "opacity": 0.82, "borderColor": "#fff", "borderWidth": 1},
            "fundingUsd": funding,
        })
    option = {
        "tooltip": {
            "trigger": "item",
            "formatter": (
                "{b}<br/>Startups: {c}<br/>Total funding: (see caption)"
            ),
        },
        "geo": {
            "map": "world",
            "roam": True,
            "zoom": 3.1,
            "center": [21, 3],
            "itemStyle": {"areaColor": "#eef1ee", "borderColor": "#d6dad5"},
            "emphasis": {"itemStyle": {"areaColor": "#e4e8e3"}},
        },
        "series": [{
            "name": "African startups (2014)",
            "type": "scatter",
            "coordinateSystem": "geo",
            "data": data,
            "label": {"show": False},
        }],
    }
    write_figure(
        "r1_fig3",
        "Geographic distribution of African startups, 2014",
        "Geographic distribution of the 194 African startups in the 2014 snapshot. Bubble size reflects the number of funded startups; red marks the Big Four hubs (over 30% of total disclosed funding each).",
        [panel(None, option, needs_geo_map=True, height=420)],
    )


def r1_fig4():
    years = list(range(2005, 2015))
    new_startups = [4, 1, 3, 7, 13, 16, 23, 35, 42, 49]
    cumulative = [4, 5, 8, 15, 28, 44, 67, 102, 144, 193]
    option = {
        "color": [FOREST, GOLD],
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 0, "textStyle": {"fontSize": 11}},
        "grid": {"left": 56, "right": 56, "top": 40, "bottom": 34, "containLabel": True},
        "xAxis": {"type": "category", "data": [str(y) for y in years], "axisLabel": {"fontSize": 10}},
        "yAxis": [
            {"type": "value", "name": "Newly funded startups", "nameTextStyle": {"fontSize": 11}},
            {"type": "value", "name": "Cumulative", "nameTextStyle": {"fontSize": 11}},
        ],
        "series": [
            {"name": "Newly funded startups", "type": "bar", "data": new_startups, "itemStyle": {"color": FOREST}, "barMaxWidth": 34},
            {"name": "Cumulative", "type": "line", "data": cumulative, "yAxisIndex": 1, "itemStyle": {"color": GOLD}, "symbolSize": 6, "lineStyle": {"width": 2.4}},
        ],
    }
    write_figure(
        "r1_fig4",
        "Africa: newly funded startups per year, the ecosystem is young and accelerating",
        "Newly funded African startups per year, 2005 to 2014, with the cumulative count.",
        [panel(None, option)],
    )


def r1_fig5():
    stages = ["Any funding", "Raised a seed round", "Raised 2+ rounds", "Reached Series A", "Reached Series B"]
    africa = [100.0, 40.2, 17.0, 7.2, 3.6]
    na = [100.0, 24.7, 40.8, 20.0, 12.9]
    option = grouped_bar_option(stages, [("Africa (n=194)", africa), ("North America (n=30,196)", na)],
                                 y_name="% of region total", colors=[RED, BLUE], rotate_x=15)
    write_figure(
        "r1_fig5",
        "The funding ladder: Africa versus North America",
        "The funding ladder in Africa versus North America: percentage of startups reaching each funding stage.",
        [panel(None, option)],
    )


def r1_fig6():
    left_cats = ["Africa", "Latin America & Caribbean", "Southeast Asia", "China", "North America"]
    left_vals = [40, 40, 315, 400, 500]
    left_colors = [RED if c == "Africa" else GREY for c in left_cats]
    left = per_point_bar_option(left_cats, "Median seed cheque ($K)", left_vals, left_colors, y_name="$K", horizontal=True)

    right_cats = ["Latin America & Caribbean", "Africa", "Southeast Asia", "China", "North America"]
    right_vals = [2.4, 5.1, 8.0, 11.1, 15.6]
    right_colors = [RED if c == "Africa" else GREY for c in right_cats]
    right = per_point_bar_option(right_cats, "Seed to Series A (%)", right_vals, right_colors, y_name="%", horizontal=True)

    write_figure(
        "r1_fig6",
        "The seed cheque gap and its consequence",
        "Left: median seed cheque by region (USD thousands). Right: seed to Series A conversion rate by region.",
        [panel("Median seed cheque (USD thousands)", left),
         panel("Seed to Series A conversion (%)", right)],
    )


def r1_fig7():
    feat_cats = ["country_group_ISR", "country_group_GBR", "country_group_CHL", "market_group_Curated Web",
                 "country_group_Other", "years_to_first_funding", "country_group_USA", "n_categories",
                 "first_funding_year", "log_seed"]
    feat_vals = [0.0003, 0.0004, 0.0004, 0.0005, 0.0068, 0.0092, 0.0134, 0.0163, 0.0332, 0.1332]
    left = per_point_bar_option(feat_cats, "Permutation importance", feat_vals, [FOREST] * len(feat_vals),
                                 y_name="AUC decrease", horizontal=True)
    left["grid"]["left"] = 170

    train_sizes = [691, 1671, 2651, 3631, 4611]
    train_score = [0.809, 0.785, 0.781, 0.780, 0.776]
    cv_score = [0.734, 0.744, 0.750, 0.754, 0.755]
    cv_std = [0.014, 0.017, 0.018, 0.019, 0.019]
    lower = [c - s for c, s in zip(cv_score, cv_std)]
    upper = [c + s for c, s in zip(cv_score, cv_std)]
    series = band_series("CV ± 1 std", lower, upper, GOLD)
    series += [
        {"name": "Training score", "type": "line", "data": train_score, "itemStyle": {"color": FOREST}, "symbolSize": 6, "lineStyle": {"width": 2.4}},
        {"name": "Cross-validation score", "type": "line", "data": cv_score, "itemStyle": {"color": GOLD}, "symbolSize": 6, "lineStyle": {"width": 2.4}},
    ]
    right = {
        "color": [FOREST, GOLD],
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 0, "textStyle": {"fontSize": 10}, "data": ["Training score", "Cross-validation score"]},
        "grid": {"left": 56, "right": 24, "top": 40, "bottom": 40, "containLabel": True},
        "xAxis": {"type": "category", "data": [str(t) for t in train_sizes], "name": "Training examples", "nameLocation": "middle", "nameGap": 28, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "value", "name": "ROC-AUC", "min": 0.65, "max": 0.85},
        "series": series,
    }

    write_figure(
        "r1_fig7",
        "What predicts Series A graduation",
        "Left: permutation importance of features predicting Series A graduation. Right: random forest learning curve used as an overfitting check (shaded band = ± 1 std of cross-validation score).",
        [panel("Permutation importance (drop in test AUC when feature is shuffled)", left, height=300),
         panel("Learning curve (random forest)", right)],
    )


# ---------------------------------------------------------------------------
# R2 -- From Frontier to Market (2014 vs 2026)
# ---------------------------------------------------------------------------

def r2_fig1():
    years = list(range(2005, 2026))
    afr_hist = {2005: 16.31, 2006: 40.83, 2007: 9.55, 2008: 2.29, 2009: 241.69, 2010: 121.71,
                2011: 38.04, 2012: 108.57, 2013: 414.79, 2014: 675.27}
    partech = {2015: 277, 2016: 367, 2017: 560, 2018: 1163, 2019: 2020, 2020: 1430, 2021: 5200,
               2022: 4900, 2023: 2300, 2024: 2200, 2025: 2400}
    bigdeal = {2019: 2020, 2020: 1400, 2021: 4300, 2022: 4600, 2023: 2900, 2024: 2200, 2025: 3200}
    disrupt = {2015: 185.8, 2016: 129.1, 2017: 195.1}

    def series_for(d):
        return [round(d[y], 2) if y in d else None for y in years]

    option = multi_line_option(
        years,
        [
            ("2014 snapshot (lifetime raise by first-funding cohort)", series_for(afr_hist)),
            ("Africa: The Big Deal (equity+debt, deals ≥$100K)", series_for(bigdeal)),
            ("Partech (equity only)", series_for(partech)),
            ("Disrupt Africa (disclosed equity only)", series_for(disrupt)),
        ],
        y_name="USD millions (log)", log_scale=True, colors=[GREY, RED, FOREST, GOLD],
    )
    option["yAxis"]["min"] = 1
    write_figure(
        "r2_fig1",
        "African startup funding per year, 2005 to 2025 (log scale)",
        "African startup funding per year, 2005 to 2025, on a log scale, combining the 2014 snapshot cohorts, Partech (equity), Africa: The Big Deal (equity plus debt) and Disrupt Africa (disclosed equity).",
        [panel(None, option, height=380)],
    )


def r2_fig2():
    a = per_point_bar_option(
        ["2014 (% of startups ever using debt)", "2025 (debt as % of funding value)"],
        "Debt rail", [4.6, 40], [GREY, RED], y_name="%")
    a["xAxis"]["axisLabel"]["fontSize"] = 9

    b = per_point_bar_option(["ever, up to 2014", "2024", "2025"], "M&A deals", [2, 39, 67],
                              [GREY, GREY, RED], y_name="Deals")

    c = per_point_bar_option(["$100K–$1M", "$1M–$10M", "≥$10M"], "Big-4 share of deals", [56, 69, 81],
                              [FOREST, FOREST, FOREST], y_name="% HQ'ed in Big 4")
    c["series"][0]["markLine"] = {
        "silent": True, "symbol": "none", "lineStyle": {"type": "dashed", "color": CHARCOAL},
        "data": [{"yAxis": 66, "label": {"formatter": "2014: Big-4 share of all companies", "fontSize": 10}}],
    }

    d = grouped_bar_option(
        ["Kenya", "South Africa", "Egypt", "Nigeria"],
        [("2014 (lifetime, cumulative)", [286.12, 646.72, 430.44, 275.94]),
         ("2025 alone (Partech)", [1040, 715, 604, 572])],
        y_name="USD millions", colors=[GREY, RED],
    )

    write_figure(
        "r2_fig2",
        "Four structural shifts, 2014 to 2025 and 2026",
        "Four structural shifts, 2014 to 2025 and 2026: the debt rail, the exit market, concentration by deal size and Big Four country totals. One year of 2025 versus all history to 2014.",
        [panel("The debt rail materialised", a),
         panel("Startup acquisitions (M&A deals)", b),
         panel("2025: Big-4 share of deals rises with deal size", c),
         panel("Big Four: one year of 2025 beats all history to 2014", d)],
    )


def r2_fig3():
    rows = [
        ("Interswitch", "Nigeria", 1.0), ("Moniepoint", "Nigeria", 1.0), ("MNT-Halan", "Egypt", 1.0),
        ("Tyme Group", "South Africa", 1.5), ("Andela", "Nigeria / US", 1.5),
        ("Wave", "Senegal", 1.7), ("OPay", "Nigeria", 2.8), ("Flutterwave", "Nigeria", 3.0),
    ]
    country_color = {"Nigeria": FOREST, "Egypt": GOLD, "South Africa": BLUE, "Senegal": RED, "Nigeria / US": FOREST_LIGHT}
    cats = [f"{name} ({country})" for name, country, _ in rows]
    vals = [v for _, _, v in rows]
    colors = [country_color[c] for _, c, _ in rows]
    option = per_point_bar_option(cats, "Valuation ($B)", vals, colors, y_name="Valuation (USD billions, early-2026, conservative)", horizontal=True)
    option["grid"]["left"] = 150
    write_figure(
        "r2_fig3",
        "Africa's unicorns, 2026",
        "Africa's unicorns as of early 2026, conservative valuations (USD billions). All are fintech or fintech adjacent.",
        [panel(None, option, height=300)],
    )


def r2_fig4():
    a = per_point_bar_option(["2024", "2025"], "Female CEO funding share", [2.0, 2.2], [RED, RED], y_name="%")
    a["yAxis"]["max"] = 10

    years = list(range(2019, 2026))
    bigdeal = [2020, 1400, 4300, 4600, 2900, 2200, 3200]
    b = multi_line_option(years, [("Big Deal annual funding", bigdeal)], y_name="USD millions", colors=[FOREST], area={"Big Deal annual funding"})
    b["legend"]["show"] = False

    c = per_point_bar_option(["2020", "2025"], "Foreign acquirer share", [56.0, 33.0], [GREY, FOREST], y_name="%")

    write_figure(
        "r2_fig4",
        "New realities invisible in the 2014 data",
        "Left: funding share of female CEO startups (97 to 98% of capital goes to male-led companies). Centre: the boom, winter and recovery cycle (annual funding, USD millions). Right: exits localising, foreign acquirer share of M&A, 2020 versus 2025.",
        [panel("Share of funding to female-CEO startups", a),
         panel("Boom, winter, recovery (Big Deal, $M)", b),
         panel("Share of exits bought by FOREIGN acquirers", c)],
    )


# ---------------------------------------------------------------------------
# R3 -- Where the Continent Is Heading (2026 to 2030 forecast)
# ---------------------------------------------------------------------------

FUND_2015_2025 = {2015: 277, 2016: 367, 2017: 560, 2018: 1163, 2019: 2020, 2020: 1400, 2021: 4300,
                   2022: 4600, 2023: 2900, 2024: 2200, 2025: 3200}


def r3_fig1():
    years = list(range(2015, 2026))
    vals = [FUND_2015_2025[y] for y in years]
    left = simple_bar_option([str(y) for y in years], "Annual funding", vals, y_name="USD millions",
                              color=FOREST, rotate_x=0)
    left["series"][0]["markLine"] = {
        "silent": True, "symbol": "none", "lineStyle": {"type": "dashed", "color": GOLD},
        "data": [{"yAxis": 1440, "label": {"formatter": "H1 2026 actual: $1,440M (half-year)", "fontSize": 10, "color": GOLD}}],
    }

    growth_years = list(range(2016, 2026))
    growth = [32.5, 52.6, 107.7, 73.7, -30.7, 207.1, 7.0, -37.0, -24.1, 45.5]
    colors = [GREEN if g >= 0 else RED for g in growth]
    right = per_point_bar_option([str(y) for y in growth_years], "YoY growth", growth, colors, y_name="%")

    write_figure(
        "r3_fig1",
        "The series we must forecast: African startup funding, 2015 to 2025",
        "Left: annual African startup funding 2015 to 2025 (USD millions) with the H1 2026 actual marked. Right: year on year growth rates, the volatility problem.",
        [panel("African startup funding, 2015 to 2025 (USD millions)", left),
         panel("Year-on-year growth (%)", right)],
    )


def r3_fig2():
    years = [2023, 2024, 2025]
    option = multi_line_option(
        years,
        [
            ("Actual", [2900, 2200, 3200]),
            ("Log-linear (MAPE 357%)", [7794, 11862, 18052]),
            ("Damped CAGR (MAPE 167%)", [5736, 7153, 8919]),
            ("Naive (MAPE 70%)", [4600, 4600, 4600]),
        ],
        y_name="USD millions", colors=[CHARCOAL, RED, GOLD, GREY],
        dash={"Log-linear (MAPE 357%)", "Damped CAGR (MAPE 167%)", "Naive (MAPE 70%)"},
    )
    write_figure(
        "r3_fig2",
        "Backtest: what each model would have predicted for 2023 to 2025",
        "Backtest: three models trained on 2015 to 2022 and scored on their 2023 to 2025 predictions. The log linear trend shows how optimistic headline projections are manufactured.",
        [panel(None, option)],
    )


def r3_fig3():
    hist_years = list(range(2015, 2026))
    hist_vals = [FUND_2015_2025[y] for y in hist_years]
    fc_years = list(range(2026, 2031))
    start = 3200

    def geo_path(target):
        return [round(start * (target / start) ** (i / 5), 1) for i in range(1, 6)]

    p10 = geo_path(977)
    p25 = geo_path(1874)
    p75 = geo_path(10050)
    p90 = geo_path(23087)
    bear = geo_path(2300)
    base = geo_path(5500)
    bull = geo_path(11000)

    x = [str(y) for y in hist_years] + [str(y) for y in fc_years]

    def full(forecast_vals):
        """Pads a 2026-2030 series with Nones over the historical years, anchored at the 2025 actual."""
        return [None] * (len(hist_years) - 1) + [hist_vals[-1]] + forecast_vals

    series = []
    series += band_series("MC 10–90% band", full(p10), full(p90), "#c9c9c4")
    series += band_series("MC 25–75% band", full(p25), full(p75), "#a9a9a2")
    series.append({"name": "Actual", "type": "line", "data": [*hist_vals, None, None, None, None, None],
                    "itemStyle": {"color": CHARCOAL}, "symbolSize": 5, "lineStyle": {"width": 2.2}})
    for name, path, color in [("Bear ≈$2.3B", bear, RED), ("Base ≈$5.5B", base, FOREST), ("Bull ≈$11B", bull, GREEN)]:
        series.append({
            "name": name, "type": "line", "data": full(path),
            "itemStyle": {"color": color}, "lineStyle": {"width": 2.2, "type": "dashed"}, "symbolSize": 5,
        })

    option = {
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 0, "textStyle": {"fontSize": 10}, "type": "scroll",
                   "data": ["Actual", "MC 10–90% band", "MC 25–75% band", "Bear ≈$2.3B", "Base ≈$5.5B", "Bull ≈$11B"]},
        "grid": {"left": 60, "right": 24, "top": 44, "bottom": 34, "containLabel": True},
        "xAxis": {"type": "category", "data": x, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "value", "name": "USD millions"},
        "series": series,
    }
    write_figure(
        "r3_fig3",
        "African startup funding: scenarios for 2026 to 2030",
        "African startup funding: scenarios for 2026 to 2030 inside the Monte Carlo band. Shaded bands show the 10 to 90% and 25 to 75% probability ranges (interpolated from the model's terminal-year 2030 percentiles); dashed lines are the bear, base and bull scenario paths.",
        [panel(None, option, height=380)],
    )


def r3_fig4():
    years_actual = [2022, 2023, 2024, 2025, 2026]
    debt_actual = [25, 34, 32, 40, 33]
    debt_base_2026_2030 = [35, 36.25, 37.5, 38.75, 40]
    debt_years = years_actual + [2027, 2028, 2029, 2030]
    debt_full = debt_actual + debt_base_2026_2030[1:]
    band_lower = [None] * len(years_actual) + [30] * 4
    band_upper = [None] * len(years_actual) + [48] * 4
    a_series = [
        {"name": "Actual / base forecast", "type": "line", "data": [round(v, 2) for v in debt_full],
         "itemStyle": {"color": FOREST}, "lineStyle": {"width": 2.2}, "symbolSize": 5},
    ]
    a = {
        "tooltip": {"trigger": "axis"}, "grid": {"left": 50, "right": 20, "top": 20, "bottom": 30, "containLabel": True},
        "xAxis": {"type": "category", "data": [str(y) for y in debt_years], "axisLabel": {"fontSize": 9}},
        "yAxis": {"type": "value", "name": "%", "min": 0, "max": 60},
        "series": a_series,
    }

    exit_years = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
    exit_base = [39, 67, 100.8, 115.9, 133.3, 153.3, 176.2]
    exit_bear = [None, None] + [round(v * 0.6, 1) for v in exit_base[2:]]
    exit_bull = [None, None] + [round(v * 1.5, 1) for v in exit_base[2:]]
    b = {
        "tooltip": {"trigger": "axis"}, "grid": {"left": 50, "right": 20, "top": 20, "bottom": 30, "containLabel": True},
        "legend": {"show": False},
        "xAxis": {"type": "category", "data": [str(y) for y in exit_years], "axisLabel": {"fontSize": 9}},
        "yAxis": {"type": "value", "name": "Deals"},
        "series": [
            {"name": "Bull (1.5x)", "type": "line", "data": exit_bull, "lineStyle": {"opacity": 0.3, "type": "dashed", "color": GREEN}, "symbolSize": 0},
            {"name": "Bear (0.6x)", "type": "line", "data": exit_bear, "lineStyle": {"opacity": 0.3, "type": "dashed", "color": RED}, "symbolSize": 0},
            {"name": "Exits (M&A per year)", "type": "line", "data": [round(v, 1) for v in exit_base], "itemStyle": {"color": FOREST}, "lineStyle": {"width": 2.4}, "symbolSize": 6},
        ],
    }

    deal_years = list(range(2026, 2031))
    deal_bear = [380, 350, 330, 320, 310]
    deal_base = [400, 440, 480, 530, 580]
    deal_bull = [420, 520, 650, 800, 950]
    c = multi_line_option(deal_years, [("Bear", deal_bear), ("Base", deal_base), ("Bull", deal_bull)],
                           y_name="Deals", colors=[RED, FOREST, GREEN])
    c["series"].append({"name": "2025 actual", "type": "scatter", "data": [None, None, None, None, 506],
                         "symbolSize": 9, "itemStyle": {"color": CHARCOAL}})
    c["xAxis"]["data"] = [str(y) for y in deal_years]

    uni_years = list(range(2026, 2031))
    uni_bear = [8, 8.5, 9, 9.5, 10]
    uni_base = [8, 9.5, 11, 12.5, 14]
    uni_bull = [8, 11, 14, 17, 20]
    d = multi_line_option(uni_years, [("Bear (+0.5/yr)", uni_bear), ("Base (+1.5/yr)", uni_base), ("Bull (+3/yr)", uni_bull)],
                           y_name="Companies ≥ $1B", colors=[RED, FOREST, GREEN])

    write_figure(
        "r3_fig4",
        "Component forecasts, 2026 to 2030",
        "Component forecasts 2026 to 2030: debt share, exits, deal counts (the canary) and cumulative unicorns. Shaded areas and dashed paths mark the bear to bull range.",
        [panel("Debt as % of total funding", a),
         panel("Startup exits (M&A deals per year)", b),
         panel("Deals ≥ $100K per year", c),
         panel("Cumulative unicorns", d)],
    )


def r3_fig5():
    cats = ["Our bear $2.3B", "Our base $5.5B", "Our bull $11B", "TBI business-as-usual $62B", "TBI improved-policy $94B"]
    vals = [-6.4, 11.4, 28.0, 80.9, 96.6]
    colors = [RED, BLUE, GREEN, GREY, GREY]
    option = per_point_bar_option(cats, "Required CAGR 2025→2030", vals, colors, y_name="% per year", horizontal=True)
    option["grid"]["left"] = 150
    option["series"][0]["markLine"] = {
        "silent": True, "symbol": "none",
        "lineStyle": {"type": "dashed", "color": FOREST},
        "data": [
            {"xAxis": 8.0, "label": {"formatter": "actual mature-era growth (+8%/yr)", "fontSize": 10}},
            {"xAxis": 27.7, "label": {"formatter": "full-decade growth (+28%/yr)", "fontSize": 10, "position": "insideEndTop"}},
        ],
    }
    write_figure(
        "r3_fig5",
        "Required compound growth to hit each 2030 target",
        "Compound annual growth required to reach each 2030 target from the 2025 actual, against the historically observed growth rates.",
        [panel(None, option, height=300)],
    )


if __name__ == "__main__":
    r1_fig1(); r1_fig2(); r1_fig3(); r1_fig4(); r1_fig5(); r1_fig6(); r1_fig7()
    r2_fig1(); r2_fig2(); r2_fig3(); r2_fig4()
    r3_fig1(); r3_fig2(); r3_fig3(); r3_fig4(); r3_fig5()
    print("done")
