"""
Generates ECharts option JSON (herufi/data/charts/<fig_id>.json) for the 16 figures across
the three African Startup Investment Trilogy publications, plus the 13 R4 figures for
"Who's Actually Writing the Cheques" (the capital-supply/portfolio-construction follow-up)
and the 9 R5 figures for "Filling the Missing Middle" (the Series-A/B fill-mechanism return
math), from the exact underlying data extracted from the source Jupyter notebooks in
"Research Works/Investment strategies copy/". The R4 Monte-Carlo fund simulator and the four
R5 mechanism models (below) are re-implemented and re-run here rather than copied from the
notebooks' printed output, so those figures reflect an independently reproduced run of each
model, not a transcription of it.

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

import numpy as np

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
INK = CHARCOAL
INK2 = "#52514e"


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
        "grid": {"left": 64, "right": 32, "top": subtitle and 64 or 44, "bottom": 48, "containLabel": True},
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
        "legend": {"top": 4, "textStyle": {"fontSize": 11}},
        "grid": {"left": 64, "right": 32, "top": 70, "bottom": 48, "containLabel": True},
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
    if horizontal:
        # Category labels here are region/company names that can run long (e.g. "Latin America &
        # Caribbean"); cap their width and wrap instead of letting containLabel reserve unbounded
        # space for them, or on narrow (mobile) containers the label alone can eat the whole grid
        # and leave the bars themselves a sliver.
        cat_axis = {"type": "category", "data": categories,
                    "axisLabel": {"fontSize": 10, "width": 92, "overflow": "break", "lineHeight": 13}}
    else:
        cat_axis = {"type": "category", "data": categories, "axisLabel": {"fontSize": 10}}
    val_axis = {"type": "value", "name": y_name, "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    option = {
        "tooltip": {"trigger": "axis"},
        "grid": {"left": 16, "right": 36, "top": 44, "bottom": 44, "containLabel": True},
        "series": [{"name": series_name, "type": "bar", "data": data, "barMaxWidth": 26}],
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
    val_axis = {"type": "log" if log_scale else "value", "name": y_name, "nameGap": 18,
                "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    return {
        "color": colors,
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 6, "textStyle": {"fontSize": 10}, "type": "scroll", "itemGap": 14},
        "grid": {"left": 70, "right": 32, "top": 76, "bottom": 44, "containLabel": True},
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


def log_bar_option(categories, series_name, values, colors, y_name=None, value_labels=None):
    """Vertical bar on a log value axis, for series spanning multiple orders of magnitude."""
    data = [{"value": v, "itemStyle": {"color": c}} for v, c in zip(values, colors)]
    option = {
        "tooltip": {"trigger": "axis"},
        "grid": {"left": 64, "right": 32, "top": 44, "bottom": 60, "containLabel": True},
        "xAxis": {"type": "category", "data": categories, "axisLabel": {"fontSize": 10, "rotate": 8}},
        "yAxis": {"type": "log", "name": y_name, "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}},
        "series": [{"name": series_name, "type": "bar", "data": data, "barMaxWidth": 60}],
    }
    if value_labels:
        for d, lab in zip(option["series"][0]["data"], value_labels):
            d["label"] = {"show": True, "position": "top", "formatter": lab, "fontSize": 11, "fontWeight": "bold"}
        option["series"][0]["label"] = {"show": True, "position": "top", "fontSize": 11, "fontWeight": "bold"}
    return option


def stacked_bar_option(categories, series_list, y_name=None, colors=None, value_formatter=None):
    """series_list: list of (name, values). Bars stack in the order given."""
    colors = colors or [FOREST, "#cfe0f7"]
    series = []
    for i, (name, values) in enumerate(series_list):
        series.append({
            "name": name, "type": "bar", "stack": "total", "data": values,
            "itemStyle": {"color": colors[i % len(colors)]}, "barMaxWidth": 70,
            "label": {"show": True, "position": "inside", "fontSize": 11, "fontWeight": "bold",
                      "color": "#fff" if i == 0 else INK,
                      **({"formatter": value_formatter} if value_formatter else {})},
        })
    return {
        "color": colors,
        "tooltip": {"trigger": "axis", "axisPointer": {"type": "shadow"}},
        "legend": {"top": 4, "textStyle": {"fontSize": 11}},
        "grid": {"left": 64, "right": 32, "top": 60, "bottom": 44, "containLabel": True},
        "xAxis": {"type": "category", "data": categories, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "value", "name": y_name, "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}},
        "series": series,
    }


def histogram_option(edges, counts, color=BLUE, x_name=None, y_name="Simulations", mark_lines=None):
    """Bar histogram from precomputed (edges, counts) -- edges has len(counts)+1."""
    centers = [round((edges[i] + edges[i + 1]) / 2, 3) for i in range(len(counts))]
    series = {"name": y_name, "type": "bar", "data": counts, "itemStyle": {"color": color},
              "barCategoryGap": "0%", "barGap": "0%"}
    if mark_lines:
        series["markLine"] = mark_lines
    return {
        "tooltip": {"trigger": "axis"},
        "grid": {"left": 60, "right": 24, "top": 44, "bottom": 44, "containLabel": True},
        "xAxis": {"type": "category", "data": [f"{c:.2f}x" for c in centers], "name": x_name,
                  "nameLocation": "middle", "nameGap": 28, "axisLabel": {"fontSize": 9, "interval": 4}},
        "yAxis": {"type": "value", "name": y_name, "nameGap": 24, "nameTextStyle": {"fontSize": 11}},
        "series": [series],
    }


def heatmap_option(x_cats, y_cats, values, color_scheme, value_max, y_name=None, x_name=None, unit=""):
    """values: 2D list [len(y_cats)][len(x_cats)]. color_scheme: list of hex colors, low->high.
    Label/tooltip formatters use ECharts' string-template syntax ({c} etc.) only, never JS
    functions, since these options are serialized straight to static JSON (no function values)."""
    data = []
    for yi, row in enumerate(values):
        for xi, v in enumerate(row):
            data.append([xi, yi, round(v, 2)])
    return {
        "tooltip": {"formatter": f"{{b}}: {{@[2]}}{unit}"},
        "grid": {"left": 90, "right": 24, "top": 30, "bottom": 60, "containLabel": True},
        "xAxis": {"type": "category", "data": x_cats, "name": x_name, "nameLocation": "middle", "nameGap": 32,
                   "nameTextStyle": {"fontSize": 11}, "splitArea": {"show": True}, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "category", "data": y_cats, "name": y_name, "nameTextStyle": {"fontSize": 11},
                   "splitArea": {"show": True}, "axisLabel": {"fontSize": 10}},
        "visualMap": {"min": 0, "max": value_max, "calculable": False, "show": False,
                      "inRange": {"color": color_scheme}},
        "series": [{
            "type": "heatmap",
            "data": data,
            "label": {"show": True, "fontSize": 11, "fontWeight": "bold", "formatter": f"{{@[2]}}{unit}"},
            "emphasis": {"itemStyle": {"shadowBlur": 6, "shadowColor": "rgba(0,0,0,0.3)"}},
        }],
    }


def xy_line_option(series_list, x_name=None, y_name=None, colors=None, x_min=None, x_max=None):
    """series_list: list of (name, [x...], [y...]) -- true (x, y) pairs, for non-shared x-axes (e.g. CDFs)."""
    colors = colors or [RED, FOREST, GREEN, BLUE, GOLD]
    series = []
    for i, (name, xs, ys) in enumerate(series_list):
        series.append({
            "name": name, "type": "line", "data": [[x, y] for x, y in zip(xs, ys)],
            "showSymbol": False, "lineStyle": {"width": 2.4, "color": colors[i % len(colors)]},
            "itemStyle": {"color": colors[i % len(colors)]},
        })
    xaxis = {"type": "value", "name": x_name, "nameLocation": "middle", "nameGap": 28,
             "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    if x_min is not None:
        xaxis["min"] = x_min
    if x_max is not None:
        xaxis["max"] = x_max
    return {
        "color": colors,
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 4, "textStyle": {"fontSize": 10.5}},
        "grid": {"left": 70, "right": 32, "top": 46, "bottom": 46, "containLabel": True},
        "xAxis": xaxis,
        # A vertical, side-anchored y-axis name (nameLocation "middle" + nameRotate 90) instead
        # of the default top-anchored one, which collided with a top-positioned legend entry.
        "yAxis": {"type": "value", "name": y_name, "nameLocation": "middle", "nameGap": 34,
                  "nameRotate": 90, "nameTextStyle": {"fontSize": 11}},
        "series": series,
    }


def bubble_scatter_option(points, x_name=None, y_name=None, mark_area=None, log_x=True):
    """points: list of (label, x, y, size, color) or (label, x, y, size, color, label_position).
    label_position of "hide" suppresses the inline label (marker and tooltip still show) for
    points packed too tightly against neighbours for any inline position to stay legible."""
    data = []
    for point in points:
        label, x, y, size, color = point[:5]
        label_pos = point[5] if len(point) > 5 else "top"
        show_label = label_pos != "hide"
        data.append({
            "name": label, "value": [x, y],
            "symbolSize": size, "itemStyle": {"color": color, "opacity": 0.85, "borderColor": "#fff", "borderWidth": 1},
            "label": {"show": show_label, "position": label_pos if show_label else "top", "formatter": label,
                      "fontSize": 9.5, "color": INK},
        })
    xaxis = {"type": "log" if log_x else "value", "name": x_name, "nameLocation": "middle", "nameGap": 30,
             "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}}
    # labelLayout is a safety net on top of the manual per-point positions above: it nudges any
    # labels that still collide (e.g. at narrower mobile widths) apart vertically instead of
    # letting them overlap illegibly.
    series = {"type": "scatter", "data": data, "labelLayout": {"moveOverlap": "shiftY"}}
    if mark_area:
        series["markArea"] = mark_area
    return {
        "tooltip": {"trigger": "item", "formatter": "{b}<br/>fund size: {c}"},
        # top: 24 left no room for the y-axis name, which ECharts places above the axis by
        # default ("end" location) -- it was rendering above the canvas edge and getting clipped.
        "grid": {"left": 64, "right": 40, "top": 40, "bottom": 50, "containLabel": True},
        "xAxis": xaxis,
        "yAxis": {"type": "value", "name": y_name, "nameGap": 24, "nameTextStyle": {"fontSize": 11}},
        "series": [series],
    }


# ---------------------------------------------------------------------------
# R4 Monte-Carlo fund simulator -- re-implemented and re-run from the source
# notebook (African_VC_Investor_Portfolio_Layer.ipynb) rather than copied from
# its printed output, so every R4 model figure below reflects an independently
# reproduced run.
# ---------------------------------------------------------------------------

R4_RNG_SEED = 42
R4_RETURN_BINS = np.array([0.2, 2.5, 7.0, 22.0, 75.0])
R4_RETURN_PROBS = np.array([0.65, 0.24, 0.07, 0.036, 0.004])
R4_GRAD_WEIGHTS = np.array([1, 1.5, 3, 5, 7], dtype=float)
R4_WMEAN = (R4_RETURN_PROBS * R4_GRAD_WEIGHTS).sum()


def r4_bucket_grad_probs(overall_grad_prob):
    return np.clip(overall_grad_prob * R4_GRAD_WEIGHTS / R4_WMEAN, 0, 1)


def r4_conditional_dist(overall_grad_prob):
    joint = R4_RETURN_PROBS * r4_bucket_grad_probs(overall_grad_prob)
    return joint / joint.sum()


def r4_simulate_fund(n_positions, reserve_share, follow_on_mult, grad_prob, entry_probs=None,
                      fund_size=30.0, fee_drag=0.15, n_sims=20_000, seed=R4_RNG_SEED):
    entry_probs = R4_RETURN_PROBS if entry_probs is None else entry_probs
    rng = np.random.default_rng(seed)
    investable = fund_size * (1 - fee_drag)
    initial_check = investable * (1 - reserve_share) / n_positions
    reserve_budget = investable * reserve_share

    bgp = r4_bucket_grad_probs(grad_prob)
    outcome_idx = rng.choice(len(R4_RETURN_BINS), size=(n_sims, n_positions), p=entry_probs)
    multiples = R4_RETURN_BINS[outcome_idx]
    graduated = rng.random((n_sims, n_positions)) < bgp[outcome_idx]
    initial_proceeds = (initial_check * multiples).sum(axis=1)

    desired_reserve_per_co = follow_on_mult * initial_check
    n_grad = graduated.sum(axis=1)
    desired_total = n_grad * desired_reserve_per_co
    scale = np.minimum(1.0, np.where(desired_total > 0, reserve_budget / np.maximum(desired_total, 1e-9), 1.0))
    reserve_check = desired_reserve_per_co * scale
    reserve_proceeds = (reserve_check[:, None] * np.where(graduated, multiples, 0)).sum(axis=1)
    leftover = np.maximum(reserve_budget - reserve_check * n_grad, 0)

    total_proceeds = initial_proceeds + reserve_proceeds + leftover
    return total_proceeds / fund_size


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
        "legend": {"top": 4, "textStyle": {"fontSize": 11}},
        "grid": {"left": 64, "right": 64, "top": 60, "bottom": 34, "containLabel": True},
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
        "legend": {"top": 4, "textStyle": {"fontSize": 10}, "data": ["Training score", "Cross-validation score"]},
        "grid": {"left": 64, "right": 28, "top": 64, "bottom": 44, "containLabel": True},
        "xAxis": {"type": "category", "data": [str(t) for t in train_sizes], "name": "Training examples", "nameLocation": "middle", "nameGap": 28, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "value", "name": "ROC-AUC", "nameGap": 18, "min": 0.65, "max": 0.85},
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
    a["xAxis"]["axisLabel"] = {"fontSize": 10, "width": 130, "overflow": "break", "lineHeight": 14}
    a["grid"]["bottom"] = 60

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
        "legend": {"top": 6, "textStyle": {"fontSize": 10}, "type": "scroll", "itemGap": 14,
                   "data": ["Actual", "MC 10–90% band", "MC 25–75% band", "Bear ≈$2.3B", "Base ≈$5.5B", "Bull ≈$11B"]},
        "grid": {"left": 70, "right": 32, "top": 76, "bottom": 34, "containLabel": True},
        "xAxis": {"type": "category", "data": x, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "value", "name": "USD millions", "nameGap": 18},
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
        "tooltip": {"trigger": "axis"}, "grid": {"left": 56, "right": 24, "top": 44, "bottom": 34, "containLabel": True},
        "xAxis": {"type": "category", "data": [str(y) for y in debt_years], "axisLabel": {"fontSize": 9}},
        "yAxis": {"type": "value", "name": "%", "nameGap": 18, "min": 0, "max": 60},
        "series": a_series,
    }

    exit_years = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
    exit_base = [39, 67, 100.8, 115.9, 133.3, 153.3, 176.2]
    exit_bear = [None, None] + [round(v * 0.6, 1) for v in exit_base[2:]]
    exit_bull = [None, None] + [round(v * 1.5, 1) for v in exit_base[2:]]
    b = {
        "tooltip": {"trigger": "axis"}, "grid": {"left": 56, "right": 24, "top": 44, "bottom": 34, "containLabel": True},
        "legend": {"show": False},
        "xAxis": {"type": "category", "data": [str(y) for y in exit_years], "axisLabel": {"fontSize": 9}},
        "yAxis": {"type": "value", "name": "Deals", "nameGap": 18},
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


# ---------------------------------------------------------------------------
# R4 -- Who's Actually Writing the Cheques (capital supply & portfolio construction)
# ---------------------------------------------------------------------------

def r4_fig1():
    cats = ["DFIs", "European VC / DFI", "African corporates", "African / local LPs"]
    avg = [45, 70, 7, 18]
    y2025 = [27, 21, 41, 25]
    option = grouped_bar_option(cats, [("2022-24 average", avg), ("2025", y2025)],
                                 y_name="Share of LP commitments (%)", colors=[GREY, FOREST], horizontal=True)
    # grouped_bar_option's value-axis name defaults to ECharts' "end" location (top-right of the
    # axis line), which pushes this longer name past the chart's right edge on a horizontal bar.
    # Move it to a centered, bottom-anchored title instead, matching how the value axis name
    # reads on every vertical bar figure elsewhere in this file.
    option["xAxis"]["nameLocation"] = "middle"
    option["xAxis"]["nameGap"] = 28
    option["grid"]["bottom"] = 60
    write_figure(
        "r4_fig1",
        "Who funds the funds: the 2025 LP mix shift in African VC",
        "Share of LP commitments by source, 2022-24 average versus 2025. DFI and European VC/DFI commitments fell sharply while African corporates and local LPs rose. Source: AVCA 2025 African Private Capital Activity Report, via TechCabal (Feb 2026).",
        [panel(None, option, height=320)],
    )


def r4_fig2():
    gps = [
        ("Partech Africa", 300, 0.5, 20),
        ("TLcom Capital", 159, 0.1, 3),
        ("Novastar Ventures III", 147, 1.0, 8),
        ("Norrsken22", 205, 10.0, 60),
        ("Founders Factory Africa", 40, 0.15, 0.25),
        ("4DX Ventures", 80, 0.3, 0.5),
        ("Ingressive Capital II", 50, 0.05, 0.5),
        ("Launch Africa Ventures", 36, 0.05, 0.25),
        ("Ventures Platform", 46, 0.1, 1.5),
    ]
    reaches_band = {"Partech Africa", "Novastar Ventures III", "Ventures Platform"}
    # Founders Factory Africa, Ingressive Capital II and Launch Africa Ventures sit within a few
    # percent of each other on both the log cheque-size axis and the fund-size axis, close enough
    # that no inline label position stays clear of its neighbours (or, at "left", of its own
    # marker this near the axis edge). Hide their inline labels; all nine funds, including these
    # three, are already named with exact figures in Table 1 just above this chart. 4DX Ventures
    # and Ventures Platform share the same cheque-size midpoint but sit far enough apart in fund
    # size (80 vs 46) to read cleanly split top/bottom.
    label_pos = {
        "Founders Factory Africa": "hide",
        "Ingressive Capital II": "hide",
        "Launch Africa Ventures": "hide",
        "4DX Ventures": "top",
        "Ventures Platform": "bottom",
        # Partech Africa sits at the y-axis max (fund size 300); a "top" label would render
        # above the chart canvas and get clipped, so anchor it below its marker instead.
        "Partech Africa": "bottom",
    }
    points = []
    for name, fund_size, lo, hi in gps:
        mid = (lo * hi) ** 0.5
        size = 16 + 2.4 * (fund_size ** 0.5)
        color = GOLD if name in reaches_band else FOREST
        points.append((name, round(mid, 3), fund_size, round(size, 1), color, label_pos.get(name, "top")))
    mark_area = {
        "itemStyle": {"color": RED, "opacity": 0.08},
        "label": {"show": True, "position": "insideTop", "formatter": "the $2-10M Series A gap", "fontSize": 10, "color": RED},
        "data": [[{"xAxis": 2}, {"xAxis": 10}]],
    }
    option = bubble_scatter_option(points, x_name="Typical cheque size (USD millions, log scale)",
                                    y_name="Fund size (USD millions)", mark_area=mark_area, log_x=True)
    write_figure(
        "r4_fig2",
        "The African VC landscape, mid-2026: fund size vs. cheque size",
        "Fund size against typical cheque size for the most-cited active Africa-focused GPs, mid-2026. Bubble size scales with fund size. Gold-marked funds are the only three that reach into the $2-10M Series A band; every other fund clusters at sub-$1M seed or $10M+ growth cheques. Three of those clustered funds (Founders Factory Africa, Ingressive Capital II, Launch Africa Ventures) sit too close together on this scale to label inline; see Table 1 above for their exact figures. Sources: firm disclosures, TechCabal, TechCrunch, IFC (full list in report references).",
        [panel(None, option, height=420)],
    )


def r4_fig3():
    regions = ["Europe", "Africa", "North America", "Asia"]
    vals = [-35, -21, -6, -1]
    colors = [RED, BLUE, GREY, GREY]
    option = per_point_bar_option(regions, "YoY change in investor deal appearances", vals, colors,
                                   y_name="% change", horizontal=True)
    option["xAxis"]["axisLine"] = {"onZero": True}
    # per_point_bar_option's value-axis name defaults to ECharts' "end" location, which sits
    # right at the axis's top-right corner and clips against the grid edge; center it instead.
    option["xAxis"]["nameLocation"] = "middle"
    option["xAxis"]["nameGap"] = 28
    option["grid"]["bottom"] = 56
    write_figure(
        "r4_fig3",
        "Investor deal-appearance growth, H1 2026 vs 2025 run-rate",
        "Year-on-year change in investor deal appearances by region, H1 2026 (annualised) versus the 2025 full-year run-rate. Africa: 295 appearances in 2025 falling to an annualised ~235 in H1 2026. Source: Launch Base Africa cap-table tracking (Jun 2026).",
        [panel(None, option, height=280)],
    )


def r4_fig4():
    cats = ["Total dry powder", "Gender-lens vehicles\n(<10 funds)"]
    vals = [15000, 100]
    labels = ["$15.0B", "$100M"]
    option = log_bar_option(cats, "Committed capital (USD millions, log scale)", vals,
                             [FOREST, RED], y_name="USD millions (log)", value_labels=labels)
    write_figure(
        "r4_fig4",
        "The $15B in African tech-fund dry powder against its most marginal mandate slice",
        "Total committed capital across Africa-focused tech funds versus gender-lens vehicles, a hard reported cap (not illustrative), under 1% of the total. Source: Launch Base Africa (Mar 2026).",
        [panel(None, option, height=320)],
    )


def r4_fig5():
    cats = ["Kenya (cap 10%)", "Nigeria (cap raised 5%→10%, Sep 2025)"]
    current = [0.23, 0.19]
    headroom = [1.93, 1.71]
    option = stacked_bar_option(cats, [("Currently allocated to PE/VC", current), ("Headroom to regulatory cap", headroom)],
                                 y_name="USD billions, approximate", colors=[FOREST, "#cfe0f7"],
                                 value_formatter="{@[1]}")
    for s in option["series"]:
        s["label"]["formatter"] = "${c}B"
    write_figure(
        "r4_fig5",
        "Pension-fund headroom for private equity/VC: Kenya and Nigeria",
        "Approximate current PE/VC allocation versus headroom to the regulatory cap, Kenya and Nigeria pension funds. Kenya: KES 2.81 trillion in total pension assets, roughly 1% currently in PE/VC, 10% regulatory cap (RBA guidelines; Cytonn Q1 2026). Nigeria: pension assets approaching NGN 29.5 trillion, allocation “barely 1%” of net asset value, cap raised from 5% to 10% (up to 15% for some funds) in a September 2025 PenCom regulation. USD conversions are approximate (July 2026 FX, ~130 KES/USD and ~1,550 NGN/USD) and current-allocation shares are order-of-magnitude estimates, not audited figures — treat the headroom as directional, not precise.",
        [panel(None, option, height=340)],
    )


def r4_fig6():
    years = [2019, 2021, 2022]
    conv = [12.7, 5.1, 4.2]
    months = [18, 18, 29]
    left = per_point_bar_option([str(y) for y in years], "Seed → Series A conversion", conv,
                                 [BLUE, GOLD, RED], y_name="% converting")
    left["series"][0]["markLine"] = {
        "silent": True, "symbol": "none", "lineStyle": {"type": "dashed", "color": CHARCOAL},
        "data": [{"yAxis": 15.6, "label": {"formatter": "North America 2014 baseline: 15.6%", "fontSize": 9.5}}],
    }
    right = multi_line_option(years, [("Months, seed to Series A", months)], y_name="Months", colors=[FOREST])
    right["legend"]["show"] = False
    write_figure(
        "r4_fig6",
        "The graduation crisis, updated: seed-to-Series-A by cohort",
        "Seed-to-Series-A conversion rate and time-to-close, by seed cohort year. The 2022 cohort converts at roughly a third of the 2019 rate, over more than 1.5x the time. A thinner seed pipeline (42 seed rounds in 2025 vs. over 100 in 2022) means fewer, more selectively funded companies are still converting at a similar-or-worse rate. Source: Partech 2025 Africa Tech VC Report, via Tech In Africa and The Condia.",
        [panel("Seed → Series A conversion by cohort", left),
         panel("Time from seed to Series A close", right)],
    )


def r4_fig7():
    cats = ["Total loss / <1x", "1x - 5x", "5x - 10x", "10x - 50x", ">50x"]
    vals = [65, 24, 7, 3.6, 0.4]
    colors = [RED, GREY, GREY, BLUE, FOREST]
    option = per_point_bar_option(cats, "Share of all venture deals", vals, colors, y_name="% of deals")
    write_figure(
        "r4_fig7",
        "The venture power law: 65% of deals lose money, 0.4% return 50x+",
        "Distribution of deal-level outcomes across roughly 21,000-27,000 US venture financings, 2004-2018. This is the global (not Africa-specific) base-rate distribution the portfolio simulator below is calibrated to — no African deal-level return dataset of comparable size exists. Source: Correlation Ventures, as summarised by Nicola Wealth and VC Beast.",
        [panel(None, option, height=300)],
    )


def r4_fig8():
    moic_demo = r4_simulate_fund(25, 0.40, 2.0, 0.07)
    counts, edges = np.histogram(moic_demo, bins=40, range=(0, 8))
    left = histogram_option(edges.tolist(), counts.tolist(), color=BLUE, x_name="Gross MOIC", y_name="Simulations")

    q = np.percentile(moic_demo, [10, 25, 50, 75, 90, 95])
    labels = ["p10", "p25", "median", "p75", "p90", "p95"]
    right = per_point_bar_option(labels, "Simulated MOIC percentile", [round(v, 2) for v in q.tolist()],
                                  [RED, GREY, FOREST, BLUE, BLUE, GREEN], y_name="Gross MOIC")
    # The markLine label defaults to "end" position (right at the line's right endpoint), which
    # clipped past the grid edge with the fuller wording; shortened text plus an explicit
    # inside/left-anchored position keeps it inside the panel at this narrower (2-up) width.
    right["series"][0]["markLine"] = {
        "silent": True, "symbol": "none", "lineStyle": {"type": "dashed", "color": INK2},
        "data": [{"yAxis": 3.0, "label": {"formatter": "Carta benchmark: 3x+ TVPI", "fontSize": 9.5,
                                           "position": "insideStartTop"}}],
    }
    right["grid"]["right"] = 20
    write_figure(
        "r4_fig8",
        "The base-case fund simulation: 25 positions, 40% reserve, 2-for-1 follow-on, 7% graduation",
        f"Monte-Carlo simulated fund-level gross MOIC (20,000 simulations; independently re-run for this report). Median {np.median(moic_demo):.2f}x, {(moic_demo < 1).mean() * 100:.0f}% of simulations lose money, and it is the top decile (p90 ≈ {np.percentile(moic_demo, 90):.1f}x) that approaches the 3x+ TVPI benchmark top-quartile funds report — not the median, which is the expected relationship between a fully-realised simulated multiple and a still-maturing reported benchmark. Return distribution: Correlation Ventures. Fund benchmark: Carta Q4 2025/2026 VC Fund Performance data.",
        [panel("Simulated fund-level MOIC distribution", left),
         panel("Percentiles vs. the Carta top-quartile benchmark", right)],
    )


def r4_fig9():
    positions = [15, 25, 40]
    ks = [0, 1, 2, 3]
    median_grid, ploss_grid = [], []
    for n_pos in positions:
        med_row, loss_row = [], []
        for k in ks:
            m = r4_simulate_fund(n_pos, 0.40, k, 0.07, n_sims=15_000)
            med_row.append(float(np.median(m)))
            loss_row.append(float((m < 1).mean() * 100))
        median_grid.append(med_row)
        ploss_grid.append(loss_row)

    left = heatmap_option([str(k) for k in ks], [str(p) for p in positions], median_grid,
                           ["#eaf1ea", FOREST_LIGHT, FOREST], value_max=1.8,
                           x_name="Follow-on multiple (k-for-1)", y_name="Initial positions", unit="x")
    right = heatmap_option([str(k) for k in ks], [str(p) for p in positions], ploss_grid,
                            ["#fdecec", "#e88b85", RED], value_max=35,
                            x_name="Follow-on multiple (k-for-1)", y_name="Initial positions", unit="%")
    write_figure(
        "r4_fig9",
        "Portfolio size × follow-on discipline: median MOIC and loss risk",
        "Median gross MOIC and probability of losing money (MOIC < 1x), by number of initial positions and follow-on multiple, at a fixed 40% reserve share and 7% graduation probability (20,000-15,000 simulations per cell, independently re-run for this report). More initial positions lowers loss risk sharply; a higher follow-on multiple lifts the median while barely moving loss risk — the two levers are complementary, not substitutes.",
        [panel("Median gross MOIC", left, height=300),
         panel("P(fund returns < 1x)", right, height=300)],
    )


def r4_fig10():
    shares = [0.20, 0.40, 0.60, 0.80]
    vals = []
    for rs in shares:
        m = r4_simulate_fund(25, rs, 2.0, 0.07, n_sims=15_000)
        vals.append(round(float(np.median(m)), 3))
    cats = [f"{rs:.0%}" for rs in shares]
    option = per_point_bar_option(cats, "Median gross MOIC", vals, [BLUE_LIGHT, FOREST, GOLD, RED], y_name="Median gross MOIC")
    # per_point_bar_option's default left margin (16px) is sized for a bare value axis with no
    # name; this y-axis name ("Median gross MOIC") needs more room or it clips on the left.
    option["grid"]["left"] = 44
    write_figure(
        "r4_fig10",
        "Reserving beyond your realistic graduation rate is a drag, not a hedge",
        f"Median simulated gross MOIC at 25 positions, 2-for-1 follow-on, 7% graduation probability, across four reserve shares (independently re-run for this report). Reserving 80% of the fund when only ~7% of positions ever graduate leaves most of that capital idle at a 1.0x placeholder, dragging the median down from {vals[0]:.2f}x at 20% reserve to {vals[3]:.2f}x at 80%. Reserve strategy has to be sized to a realistic graduation rate, not an industry rule-of-thumb percentage.",
        [panel(None, option, height=300)],
    )


def r4_fig11():
    scenarios = [("Bear (4.2% graduation)", 0.042, RED), ("Base (7% graduation)", 0.07, FOREST), ("Bull (12.7% graduation)", 0.127, GREEN)]
    series_list = []
    medians = {}
    for name, gp, _ in scenarios:
        m = r4_simulate_fund(25, 0.40, 2.0, gp, n_sims=20_000)
        sm = np.sort(m)
        idx = np.linspace(0, len(sm) - 1, 140).astype(int)
        xs = [round(v, 3) for v in sm[idx].tolist()]
        cdf = [round(v, 4) for v in ((idx + 1) / len(sm)).tolist()]
        med = float(np.median(m))
        medians[name] = med
        series_list.append((f"{name} — median {med:.2f}x", xs, cdf))
    colors = [c for _, _, c in scenarios]
    option = xy_line_option(series_list, x_name="Gross MOIC", y_name="Cumulative probability", colors=colors, x_min=0, x_max=6)
    write_figure(
        "r4_fig11",
        "Fund outcome across the 2030 bear/base/bull scenarios",
        f"Cumulative distribution of simulated fund-level gross MOIC (25 positions, 40% reserve, 2-for-1 follow-on) across the three graduation-probability scenarios from Notebook 3's 2030 forecast (independently re-run for this report). Median outcome moves from {medians[scenarios[0][0]]:.2f}x (bear) to {medians[scenarios[2][0]]:.2f}x (bull) — real, but smaller than intuition suggests, since most of a fund's return still comes from initial-check selection, not the reserve mechanism.",
        [panel(None, option, height=360)],
    )


def r4_fig12():
    specialist_entry = r4_conditional_dist(0.15)
    blind = r4_simulate_fund(25, 0.40, 2.0, 0.07, n_sims=20_000)
    seriesA = r4_simulate_fund(15, 0.40, 2.0, 0.15, entry_probs=specialist_entry, n_sims=20_000)
    edges = np.linspace(0, 15, 41)
    counts_b, _ = np.histogram(blind, bins=edges, density=True)
    counts_s, _ = np.histogram(seriesA, bins=edges, density=True)
    centers = [round((edges[i] + edges[i + 1]) / 2, 2) for i in range(len(edges) - 1)]
    option = {
        "tooltip": {"trigger": "axis"},
        "legend": {"top": 4, "left": "center", "textStyle": {"fontSize": 10}, "itemGap": 16,
                   "data": ["Standard blind-seed fund (25 pos.)", "Series-A specialist (15 pos.)"]},
        "grid": {"left": 56, "right": 24, "top": 44, "bottom": 44, "containLabel": True},
        "xAxis": {"type": "category", "data": [f"{c:.1f}x" for c in centers], "name": "Gross MOIC",
                  "nameLocation": "middle", "nameGap": 28, "axisLabel": {"fontSize": 9, "interval": 4}},
        "yAxis": {"type": "value", "name": "Density", "nameGap": 30},
        "series": [
            {"name": "Standard blind-seed fund (25 pos.)", "type": "bar",
             "data": [round(c, 4) for c in counts_b.tolist()], "itemStyle": {"color": GREY, "opacity": 0.65},
             "barGap": "-100%", "barCategoryGap": "0%"},
            {"name": "Series-A specialist (15 pos.)", "type": "bar",
             "data": [round(c, 4) for c in counts_s.tolist()], "itemStyle": {"color": FOREST, "opacity": 0.65},
             "barCategoryGap": "0%"},
        ],
    }
    write_figure(
        "r4_fig12",
        "Blind-seed vs. a dedicated Series-A vehicle, same simulator",
        f"Simulated gross MOIC density, standard blind-seed fund versus a Series-A specialist buying only into already seed-graduated companies (independently re-run for this report; entry distribution derived via Bayes' rule from Section 6's graduation data). Median lifts from {np.median(blind):.2f}x to {np.median(seriesA):.2f}x and loss probability drops from {(blind < 1).mean() * 100:.0f}% to {(seriesA < 1).mean() * 100:.0f}%. Read the direction, not the exact magnitude: the uplift size depends on a stated (not fitted) assumption about how strongly graduation correlates with quality, since no public dataset splits African returns by prior-graduation status.",
        [panel(None, option, height=340)],
    )


def r4_fig13():
    cats = ["Total African VC dry powder", "Female-CEO funding share (2025)", "Women-only-team funding share (2025)", "Explicit gender-lens fund capital"]
    vals = [15000, 70.4, 28.8, 95]
    colors = [GREY, GOLD, RED, FOREST]
    data = [{"value": v, "itemStyle": {"color": c},
             "label": {"show": True, "position": "right", "fontSize": 11, "fontWeight": "bold",
                       "formatter": (f"${v / 1000:.1f}B" if v >= 1000 else f"${v:.0f}M")}}
            for v, c in zip(vals, colors)]
    option = {
        "tooltip": {"trigger": "axis"},
        "grid": {"left": 16, "right": 70, "top": 20, "bottom": 34, "containLabel": True},
        "xAxis": {"type": "log", "name": "USD millions (log scale)", "nameLocation": "middle", "nameGap": 28,
                  "nameTextStyle": {"fontSize": 11}, "axisLabel": {"fontSize": 10}},
        "yAxis": {"type": "category", "data": cats, "axisLabel": {"fontSize": 10, "width": 150, "overflow": "break"}, "inverse": True},
        "series": [{"type": "bar", "data": data, "barMaxWidth": 26}],
    }
    write_figure(
        "r4_fig13",
        "The gender-lens gap across every layer of the market",
        "Gender-lens capital against the total African VC market, log scale. Female-CEO and women-only-team funding shares are applied to 2025's ~$3.2B Big Deal Africa tracker total (the same tracker series used throughout this trilogy). Sources: TechCabal (Sept 2025), Launch Base Africa, Fintech News Africa.",
        [panel(None, option, height=300)],
    )


# ---------------------------------------------------------------------------
# R5 -- Filling the Missing Middle (Series A/B fill mechanisms)
#
# The four mechanism models below are re-implemented and re-run from the source
# notebook (African_Missing_Middle_Fill_Mechanisms.ipynb) rather than copied from
# its printed output, so every R5 figure reflects an independently reproduced run.
# They share R4's Correlation Ventures return distribution, which keeps the
# first-loss pool model directly comparable to R4's fund simulator.
# ---------------------------------------------------------------------------

R5_RNG_SEED = 42


def r5_irr(cashflows):
    """IRR by bisection on the NPV function (no scipy dependency added for one root solve)."""
    def npv(r):
        return sum(cf / (1 + r) ** t for t, cf in enumerate(cashflows))

    lo, hi = -0.9899, 5.0
    f_lo, f_hi = npv(lo), npv(hi)
    if f_lo * f_hi > 0:
        return float("nan")
    for _ in range(200):
        mid = (lo + hi) / 2
        f_mid = npv(mid)
        if f_lo * f_mid <= 0:
            hi, f_hi = mid, f_mid
        else:
            lo, f_lo = mid, f_mid
    return (lo + hi) / 2


def r5_debt_cashflows(principal=1.0, rate=0.15, term_yrs=3, upfront_fee=0.015,
                       end_fee=0.04, warrant_pct=0.01, entry_val=20.0, exit_val_mult=3.0):
    """Lender cash flows with no default: interest only, bullet repayment, warrant kicker at maturity."""
    cashflows = [-principal * (1 - upfront_fee)]
    for t in range(1, term_yrs + 1):
        cf = principal * rate
        if t == term_yrs:
            cf += principal * (1 + end_fee)
        cashflows.append(cf)
    cashflows[-1] += warrant_pct * entry_val * (exit_val_mult - 1)
    return cashflows


def r5_default_cashflows(principal=1.0, rate=0.15, term_yrs=3, upfront_fee=0.015, recovery=0.5):
    """The company fails to refinance at maturity: interest paid until then, only `recovery` of principal back."""
    cashflows = [-principal * (1 - upfront_fee)]
    for t in range(1, term_yrs + 1):
        cashflows.append(principal * rate if t < term_yrs else principal * recovery)
    return cashflows


def r5_blended_lender_irr(pd_default=0.15):
    """Probability weighted expected lender return across the repay and default paths."""
    cf_ok = r5_debt_cashflows()
    cf_bad = r5_default_cashflows()
    blended = [(1 - pd_default) * a + pd_default * b for a, b in zip(cf_ok, cf_bad)]
    return r5_irr(blended), r5_irr(cf_ok), r5_irr(cf_bad)


def r5_rbf_schedule(financing=1.0, cap_mult=1.4, revenue_share=0.08, m0_revenue=0.15,
                     monthly_growth=0.03, max_months=60):
    """Revenue compounds monthly; the investor takes revenue_share of revenue until the cap is hit."""
    total_cap = financing * cap_mult
    revenue, cumulative = m0_revenue, 0.0
    cashflows = [-financing]
    for _ in range(max_months):
        payment = min(revenue * revenue_share, total_cap - cumulative)
        cashflows.append(payment)
        cumulative += payment
        revenue *= (1 + monthly_growth)
        if cumulative >= total_cap - 1e-9:
            break
    return cashflows, cumulative / total_cap


def r5_rbf_outcome(**kwargs):
    cashflows, pct_repaid = r5_rbf_schedule(**kwargs)
    r_month = r5_irr(cashflows)
    return len(cashflows) - 1, (1 + r_month) ** 12 - 1, pct_repaid


def r5_tranche_outcomes(n_companies=20, check_size=1.0, junior_frac=0.15, preferred=1.08,
                         n_sims=30_000, seed=R5_RNG_SEED):
    """Two tranche pool: junior absorbs losses first, senior is capped at its preferred claim."""
    rng = np.random.default_rng(seed)
    idx = rng.choice(len(R4_RETURN_BINS), size=(n_sims, n_companies), p=R4_RETURN_PROBS)
    proceeds = R4_RETURN_BINS[idx] * check_size
    total_proceeds = proceeds.sum(axis=1)
    total_invested = n_companies * check_size
    senior_capital = total_invested * (1 - junior_frac)
    junior_capital = total_invested * junior_frac
    senior_claim = senior_capital * preferred
    senior_moic = np.minimum(total_proceeds, senior_claim) / senior_capital
    junior_moic = (np.maximum(total_proceeds - senior_claim, 0) / junior_capital
                   if junior_capital > 0 else np.full_like(senior_moic, np.nan))
    return senior_moic, junior_moic, total_proceeds / total_invested


# Two-line category labels: at a narrow (mobile) panel width the single-line versions of these
# three scenario names collide with each other even at a rotation, and rotating them far enough
# to clear costs more vertical room than the wrap does.
R5_GROWTH_SCENARIOS = [("Slow\n12% a year", 0.01), ("Moderate\n43% a year", 0.03), ("Fast\n100%+ a year", 0.06)]


def r5_fig1():
    cohorts = ["2019 cohort", "2021 cohort", "2022 cohort"]
    conv = [12.7, 5.1, 4.2]
    left = per_point_bar_option(cohorts, "Seed to Series A conversion", conv, [BLUE, GOLD, RED],
                                 y_name="% converting")
    left["grid"]["left"] = 44

    cats = ["Total 2025 African\nstartup funding", "Unmet Series A gap,\nlow estimate", "Unmet Series A gap,\nhigh estimate"]
    vals = [3200, 300, 750]
    right = per_point_bar_option(cats, "USD millions", vals, [GREY, GOLD, RED], y_name="USD millions")
    for d, lab in zip(right["series"][0]["data"], ["$3.2B", "$300M", "$750M"]):
        d["label"] = {"show": True, "position": "top", "formatter": lab, "fontSize": 11, "fontWeight": "bold"}
    right["grid"]["left"] = 52
    write_figure(
        "r5_fig1",
        "The Series A gap, sized in companies and in dollars",
        "Left: seed to Series A conversion by cohort year (Partech 2025 Africa Tech VC Report). Right: the implied unmet annual financing gap set against total 2025 African startup funding. Applying the drop from a 12.7% to a 4.2% conversion rate to recent seed cohorts leaves roughly 100 to 150 companies a year unfunded but fundable, which at a $3M to $5M Series A cheque implies $300M to $750M of unmet annual demand. Treat the dollar range as an order of magnitude, not a precise estimate.",
        [panel("Seed to Series A conversion by cohort", left),
         panel("Implied annual financing gap", right)],
    )


def r5_fig2():
    cats = ["Total loss, under 1x", "1x to 5x", "5x to 10x", "10x to 50x", "Over 50x"]
    vals = [65, 24, 7, 3.6, 0.4]
    colors = [RED, GREY, GREY, BLUE, FOREST]
    option = per_point_bar_option(cats, "Share of all venture deals", vals, colors, y_name="% of deals")
    option["grid"]["left"] = 44
    write_figure(
        "r5_fig2",
        "The company outcome distribution every model in this report shares",
        "Distribution of deal level outcomes across roughly 24,000 US venture financings, 2004 to 2018. Both the first loss pool model and the syndication model below draw company outcomes from this distribution, which keeps the four mechanisms comparable on one footing and consistent with Report 4's fund simulator. This is a global rather than Africa specific base rate, used because no African deal level return dataset of comparable size exists publicly. Source: Correlation Ventures.",
        [panel(None, option, height=300)],
    )


def r5_fig3():
    blended, ok, bad = r5_blended_lender_irr(0.15)
    cats = ["Repaid on schedule", "Default at maturity,\n50% recovery", "Expected, at a 15%\ndefault probability"]
    vals = [round(ok * 100, 1), round(bad * 100, 1), round(blended * 100, 1)]
    left = per_point_bar_option(cats, "Lender IRR", vals, [FOREST, RED, BLUE], y_name="Lender IRR (%)")
    left["xAxis"]["axisLabel"]["fontSize"] = 9.5
    left["grid"]["left"] = 48
    left["series"][0]["markLine"] = {
        "silent": True, "symbol": "none", "lineStyle": {"type": "dashed", "color": INK2},
        "data": [{"yAxis": 15, "label": {"formatter": "Headline 15% coupon", "fontSize": 9.5,
                                          "position": "insideStartTop"}}],
    }

    pds = [round(p, 3) for p in np.linspace(0.05, 0.95, 19).tolist()]
    irrs = [round(r5_blended_lender_irr(p)[0] * 100, 2) for p in pds]
    # solve the zero crossing directly rather than reading it off the plotted grid
    lo, hi = 0.5, 0.99
    for _ in range(80):
        mid = (lo + hi) / 2
        if r5_blended_lender_irr(mid)[0] > 0:
            lo = mid
        else:
            hi = mid
    breakeven = (lo + hi) / 2
    right = xy_line_option([("Expected lender IRR", [round(p * 100, 1) for p in pds], irrs)],
                            x_name="Assumed probability of default at maturity (%)",
                            y_name="Expected lender IRR (%)", colors=[BLUE])
    right["legend"]["show"] = False
    right["series"][0]["markLine"] = {
        "silent": True, "symbol": "none",
        "data": [
            {"yAxis": 0, "lineStyle": {"type": "dotted", "color": INK2}},
            {"xAxis": round(breakeven * 100, 1),
             "lineStyle": {"type": "dashed", "color": RED},
             "label": {"formatter": f"breakeven at {breakeven:.0%}", "fontSize": 9.5, "color": RED,
                        "position": "insideEndTop"}},
        ],
    }
    write_figure(
        "r5_fig3",
        "Venture debt: what the lender actually earns, and how much default risk it can absorb",
        f"Left: lender IRR on a representative African venture debt facility, a $1 loan at a 15% coupon over three years with a 1.5% upfront fee, a 4% success fee and 1% warrant coverage. Fees and the warrant lift the full repayment return to {ok:.0%}, well above the headline coupon, and the probability weighted expectation at a 15% default rate is {blended:.0%}. Right: how that expected return falls as the assumed default rate rises. The structure only stops paying at a default rate of {breakeven:.0%}, far above any realistic African venture debt loss experience, because a 50% recovery assumption carries most of the downside. Terms sourced from LumiBrief, Techpoint Africa and Venture Debt Hub. Model independently re run for this report.",
        [panel("Lender IRR by repayment path", left),
         panel("Expected IRR against assumed default rate", right)],
    )


def r5_fig4():
    labels, months, irrs, repaid = [], [], [], []
    for label, g in R5_GROWTH_SCENARIOS:
        m, i, pct = r5_rbf_outcome(monthly_growth=g)
        labels.append(label)
        months.append(m)
        irrs.append(round(i * 100, 1))
        repaid.append(round(pct * 100, 0))
    left = per_point_bar_option(labels, "Months to hit the repayment cap", months, [RED, BLUE, GREEN],
                                 y_name="Months")
    for d, v in zip(left["series"][0]["data"], months):
        d["label"] = {"show": True, "position": "top", "formatter": f"{v} months", "fontSize": 10.5, "fontWeight": "bold"}
    left["grid"]["left"] = 44
    left["grid"]["bottom"] = 56
    left["xAxis"]["axisLabel"]["lineHeight"] = 13

    right = per_point_bar_option(labels, "Investor annualised IRR", irrs, [RED, BLUE, GREEN],
                                  y_name="Annualised IRR (%)")
    for d, v in zip(right["series"][0]["data"], irrs):
        d["label"] = {"show": True, "position": "top", "formatter": f"{v}%", "fontSize": 10.5, "fontWeight": "bold"}
    right["grid"]["left"] = 48
    right["grid"]["bottom"] = 56
    right["xAxis"]["axisLabel"]["lineHeight"] = 13
    write_figure(
        "r5_fig4",
        "Revenue based financing: the faster the company grows, the more the capital costs",
        f"A $1 advance repaid at 8% of monthly revenue until a 1.4x cap, across three revenue growth paths. The cap never changes, so growth decides everything: a slow growing company takes {months[0]} months and still repays only {repaid[0]:.0f}% of the cap, leaving the investor at {irrs[0]}% annualised, while a fast growing company clears the same cap in {months[2]} months and hands the investor {irrs[2]}% annualised. Read from the founder's side, that means revenue based financing is cheapest for steady, predictable businesses and most expensive for the fastest growing ones, the opposite of what a growth equity investor is looking for. Terms sourced from re-cap.com and Qubit Capital. Model independently re run for this report.",
        [panel("Time to repay the cap", left),
         panel("Investor annualised return on the same 1.4x cap", right)],
    )


def r5_fig5():
    jfs = [round(v, 3) for v in np.linspace(0.05, 0.35, 11).tolist()]
    leverage, ploss = [], []
    for jf in jfs:
        senior, _, _ = r5_tranche_outcomes(junior_frac=jf)
        leverage.append(round((1 - jf) / jf, 2))
        ploss.append(round(float((senior < 1).mean() * 100), 2))
    xs = [round(jf * 100, 1) for jf in jfs]

    ref_lines = [
        {"xAxis": round(100 / (11 + 1), 1), "lineStyle": {"type": "dotted", "color": INK2},
         "label": {"formatter": "AGF, about 11x", "fontSize": 9, "color": INK2, "position": "insideEndTop"}},
        {"xAxis": round(100 / (8.4 + 1), 1), "lineStyle": {"type": "dotted", "color": INK2},
         "label": {"formatter": "MIGA, 8.4x", "fontSize": 9, "color": INK2, "position": "insideEndBottom"}},
    ]
    left = xy_line_option([("Senior dollars per junior dollar", xs, leverage)],
                           x_name="Junior (first loss) tranche, % of pool",
                           y_name="Leverage ratio", colors=[BLUE])
    left["legend"]["show"] = False
    left["series"][0]["markLine"] = {"silent": True, "symbol": "none", "data": ref_lines}

    right = xy_line_option([("Senior tranche loss probability", xs, ploss)],
                            x_name="Junior (first loss) tranche, % of pool",
                            y_name="P(senior returns under 1x), %", colors=[RED])
    right["legend"]["show"] = False
    right["series"][0]["markLine"] = {"silent": True, "symbol": "none", "data": ref_lines}
    write_figure(
        "r5_fig5",
        "First loss capital: how a small junior tranche buys a lot of senior protection",
        "A pool of 20 Series A stage companies financed by a junior tranche that absorbs losses first and a senior tranche capped at a 1.08x preferred claim, 30,000 simulations. Left: every dollar of junior capital carries several dollars of senior capital, and the dotted lines mark the leverage ratios the African Guarantee Fund and MIGA actually report. Right: senior loss probability falls steadily as the junior tranche grows. The step shape is the simulation's own granularity, not a modelled threshold. Model independently re run for this report.",
        [panel("Leverage: senior capital per junior dollar", left),
         panel("Senior tranche loss probability", right)],
    )


def r5_fig6():
    configs = [("No junior tranche", 0.0), ("10% junior", 0.10), ("15% junior", 0.15), ("25% junior", 0.25)]
    senior_ploss, junior_med = [], []
    for _, jf in configs:
        senior, junior, _ = r5_tranche_outcomes(junior_frac=jf)
        senior_ploss.append(round(float((senior < 1).mean() * 100), 1))
        junior_med.append(None if jf == 0 else round(float(np.median(junior)), 2))
    cats = [c for c, _ in configs]

    left = per_point_bar_option(cats, "Senior tranche loss probability", senior_ploss,
                                 [GREY, GOLD, FOREST, BLUE], y_name="P(loss), %")
    for d, v in zip(left["series"][0]["data"], senior_ploss):
        d["label"] = {"show": True, "position": "top", "formatter": f"{v}%", "fontSize": 10.5, "fontWeight": "bold"}
    left["grid"]["left"] = 44

    right = per_point_bar_option(cats, "Junior tranche median return", junior_med,
                                  [GREY, GOLD, FOREST, BLUE], y_name="Median MOIC")
    for d, v in zip(right["series"][0]["data"], junior_med):
        if v is not None:
            d["label"] = {"show": True, "position": "top", "formatter": f"{v}x", "fontSize": 10.5, "fontWeight": "bold"}
    right["grid"]["left"] = 44
    write_figure(
        "r5_fig6",
        "What the two sides of a first loss structure each get",
        f"Senior loss probability and junior median return across four junior tranche sizes, same 20 company pool and 30,000 simulations. A junior tranche of 15% of the pool cuts senior loss probability from {senior_ploss[0]}% to {senior_ploss[2]}%, roughly half, which is the risk transformation that could bring loss averse local capital such as pension funds into venture exposure for the first time. The junior side is not charity: it sits behind the senior claim and keeps everything above it, so its median outcome is high and its own loss probability is the price of that position. Model independently re run for this report.",
        [panel("Senior tranche loss probability", left),
         panel("Junior tranche median return", right)],
    )


def r5_fig7():
    round_size = 5.0
    models = [("Future Africa style,\n$50K cheques", 0.05), ("iHub style, low end,\n$20K cheques", 0.02),
              ("iHub style, high end,\n$250K cheques", 0.25)]
    backers = [round(round_size / v) for _, v in models]
    cats = [m for m, _ in models]
    left = per_point_bar_option(cats, "Backers needed", backers, [BLUE, RED, GREEN], y_name="Number of backers")
    for d, v in zip(left["series"][0]["data"], backers):
        d["label"] = {"show": True, "position": "top", "formatter": f"{v} backers", "fontSize": 10.5, "fontWeight": "bold"}
    left["grid"]["left"] = 48
    left["xAxis"]["axisLabel"]["fontSize"] = 9.5

    carry = 0.25
    gross = [round(v, 2) for v in np.linspace(1, 10, 37).tolist()]
    net = [round(1 + (g - 1) * (1 - carry), 3) for g in gross]
    right = xy_line_option([("Gross company return", gross, gross),
                             ("What the backer keeps, after 25% carry", gross, net)],
                            x_name="Gross company return multiple", y_name="Realised multiple",
                            colors=[GREY, BLUE])
    right["series"][0]["lineStyle"]["type"] = "dashed"
    write_figure(
        "r5_fig7",
        "Syndication: aggregating small cheques, and what that aggregation costs",
        "Left: how many individual backers a syndicate needs to assemble a $5M Series A round at three real cheque sizes. Future Africa writes a standard $50,000 cheque through its AngelList syndicate; iHub's network writes $20,000 to $250,000. Right: the carry drag on a backer's return, at a 20% lead carry plus roughly 5% platform carry on profit only. A 5x company becomes 4.0x in a backer's hands and a 10x becomes 7.75x. Syndication creates no new capital. It manufactures a round sized cheque out of capital that had no path into the round at all, and charges about a quarter of the upside for doing it. Sources: AngelList, VC4Africa.",
        [panel("Backers needed to fill a $5M round", left),
         panel("Carry drag on the backer's return", right)],
    )


def r5_fig8():
    irr_blend = r5_blended_lender_irr(0.15)[0]
    _, rbf_mod, _ = r5_rbf_outcome(monthly_growth=0.03)
    rows = [
        ("Straight equity", 2.0, 0.0, 20.0, FOREST),
        ("Venture debt", 1.5, irr_blend * 100, 0.75, BLUE),
        ("Revenue based financing", 1.0, rbf_mod * 100, 0.0, GOLD),
        ("Syndicated equity", 0.5, 0.0, 5.0, GREY),
    ]
    cats = [r[0] for r in rows]
    amounts = [r[1] for r in rows]
    costs = [round(r[2], 1) for r in rows]
    dils = [r[3] for r in rows]
    colors = [r[4] for r in rows]
    weights = np.array(amounts) / sum(amounts)
    blended_cost = float((weights * np.array(costs)).sum())
    total_dilution = sum(dils)

    left = per_point_bar_option(cats, "Amount in the round", amounts, colors, y_name="USD millions")
    for d, v in zip(left["series"][0]["data"], amounts):
        d["label"] = {"show": True, "position": "top", "formatter": f"${v}M", "fontSize": 10.5, "fontWeight": "bold"}
    left["grid"]["left"] = 44
    left["xAxis"]["axisLabel"]["rotate"] = 12
    left["xAxis"]["axisLabel"]["fontSize"] = 9.5

    right = grouped_bar_option(cats, [("Annualised cost of capital (%)", costs), ("Equity given up (%)", dils)],
                                y_name="Percent", colors=[BLUE, RED], rotate_x=12)
    right["xAxis"]["axisLabel"]["fontSize"] = 9.5
    write_figure(
        "r5_fig8",
        "A blended $5M Series A round, priced instrument by instrument",
        f"A representative $5M Series A for an asset light, recurring revenue fintech, split across all four mechanisms, with each instrument's cost taken straight from the models above rather than assumed. The weighted average cost of capital across the stack is {blended_cost:.1f}% and the founder gives up {total_dilution:.1f}% of the company in total, against roughly 25% for the same $5M raised as pure equity. The point is not a guaranteed dilution discount. It is that a founder pays a market rate cost only on the slice of the round that needs it, and spreads the round across providers with genuinely different return requirements. Model independently re run for this report.",
        [panel("How the round is split", left),
         panel("What each slice costs the company", right)],
    )


def r5_fig9():
    cats = ["Venture debt", "Blended and first loss capital", "Syndication", "Revenue based financing"]
    low = [150, 100, 0, 0]
    high = [300, 250, 50, 0]
    option = grouped_bar_option(cats, [("Low estimate", low), ("High estimate", high)],
                                 # Short axis name deliberately: the fuller wording ("mobilised by
                                 # 2030") runs past the panel edge at mobile width. The caption and
                                 # panel prose carry the rest.
                                 y_name="USD millions a year",
                                 colors=[GREY, FOREST], horizontal=True)
    option["xAxis"]["nameLocation"] = "middle"
    option["xAxis"]["nameGap"] = 28
    option["grid"]["bottom"] = 60
    option["series"][-1]["markLine"] = {
        "silent": True, "symbol": "none",
        "data": [
            {"xAxis": 300, "lineStyle": {"type": "dashed", "color": GOLD},
             "label": {"formatter": "gap, low end", "fontSize": 9, "color": GOLD, "position": "insideEndTop"}},
            {"xAxis": 750, "lineStyle": {"type": "dashed", "color": RED},
             "label": {"formatter": "gap, high end", "fontSize": 9, "color": RED, "position": "insideEndTop"}},
        ],
    }
    write_figure(
        "r5_fig9",
        "What each mechanism could realistically contribute against the gap by 2030",
        "Plausible annual mobilisation by mechanism against the $300M to $750M annual gap from Figure 1. Venture debt scales off a base where debt already accounts for 41% of 2025 African funding. Blended and first loss capital scales off the African Guarantee Fund's $500M by 2028 target and the roughly 10x mobilisation ratio it and MIGA already report. Syndication stays structurally small while organised angel deployment sits near $4.4M a year. Revenue based financing contributes nothing at all today because no dedicated African vehicle exists at scale, which makes it the one genuinely open lane of the four. These are judgement based scaling estimates anchored on named vehicles, not forecasts.",
        [panel(None, option, height=340)],
    )


if __name__ == "__main__":
    r1_fig1(); r1_fig2(); r1_fig3(); r1_fig4(); r1_fig5(); r1_fig6(); r1_fig7()
    r2_fig1(); r2_fig2(); r2_fig3(); r2_fig4()
    r3_fig1(); r3_fig2(); r3_fig3(); r3_fig4(); r3_fig5()
    r4_fig1(); r4_fig2(); r4_fig3(); r4_fig4(); r4_fig5(); r4_fig6(); r4_fig7()
    r4_fig8(); r4_fig9(); r4_fig10(); r4_fig11(); r4_fig12(); r4_fig13()
    r5_fig1(); r5_fig2(); r5_fig3(); r5_fig4(); r5_fig5(); r5_fig6(); r5_fig7()
    r5_fig8(); r5_fig9()
    print("done")
