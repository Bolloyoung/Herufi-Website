"""
Ports the three Agricultural Capital series articles from their source Markdown into the
JSX content modules this site renders (content/blogs/*.tsx), and into the Markdown listing
entries (content/blog/*.md).

Why a converter rather than hand porting. The earlier series modules were hand ported, which
is fine for five pieces written once. These three are the output of a research project that is
still under test: src/test_claims.py in that project verifies 69 published figures against live
model output, so the prose changes whenever a number moves. A converter means the site copy is
always exactly the audited copy, with no opportunity for a figure to drift between the two.

What it does to the Markdown:
  - static figure embeds become <BlogFigure> with the matching ECharts JSON
  - the italic caption under each figure becomes the house <blockquote> caption, with the
    "interactive version" link dropped, because here the figure itself is the interactive one
  - pipe tables become a scrollable <table>, and the italic source line under one becomes
    a .srcnote paragraph
  - herufi.org links become <Link>, everything else stays an <a>
  - apostrophes and quotes are escaped for react/no-unescaped-entities

It also renders the standing research report and hands that render to
agri_publication_split.py, which cuts it into the three publications the site serves, one per
part of the report. The whole report is never written out as a page of its own.

Source of truth is the Agri Capital Matching project. Point --src at its blog/ directory.

Run: python3 scripts/port_agri_articles.py
"""
import argparse
import os
import re

import agri_publication_split

HERE = os.path.dirname(__file__)
SITE = os.path.join(HERE, "..")
DEFAULT_SRC = os.path.join(
    SITE, "..", "..", "..", "Startup Ecosystem ", "Investment strategies",
    "Agri Capital Matching", "blog")

# Which generated ECharts figure replaces which source poster.
FIGURE_MAP = {
    "01_loan_pnl_waterfall": "ag_fig1",
    "02_cost_vs_risk_bubbles": "ag_fig2",
    "03_guarantee_ceiling_bullet": "ag_fig3",
    "05_need_treemap": "ag_fig4",
    "06_who_finances_farmers": "ag_fig5",
    "07_opportunity_cost": "ag_fig6",
    "08_matching_matrix": "ag_fig7",
    "09_leverage_quadrant": "ag_fig8",
    "10_target_vs_actual_slope": "ag_fig9",
    "11_who_borrows_less": "ag_fig10",
    "12_scenario_margins": "ag_fig11",
    "13_volume_vs_reach": "ag_fig12",
    "14_sensitivity_lines": "ag_fig13",
    "15_constrained_decomposition": "ag_fig14",
}

ARTICLES = [
    ("part-1-why-banks-turn-down-farm-loans", "why-banks-turn-down-farm-loans",
     "WhyBanksTurnDownFarmLoans"),
    ("part-2-good-business-wrong-money", "good-business-wrong-money",
     "GoodBusinessWrongMoney"),
    ("part-3-spend-the-same-money-differently", "spend-the-same-money-differently",
     "SpendTheSameMoneyDifferently"),
]

SERIES_NAV = {
    "why-banks-turn-down-farm-loans": ("good-business-wrong-money", "Good Business, Wrong Money"),
    "good-business-wrong-money": ("spend-the-same-money-differently",
                                  "Spend the Same Money Differently"),
    "spend-the-same-money-differently": (None, None),
}

# The report that sits behind each explainer. The three reports are cut out of the one
# standing research document by agri_publication_split.py.
PUBLICATION = {
    "why-banks-turn-down-farm-loans": (
        "cost-of-a-small-loan-2026", "The Cost of a Small Loan",
        "Report 1 of the Agricultural Capital series. The full lender cost decomposition, "
        "the arithmetic ceiling on a guarantee, the tenor gap, the method and every source."),
    "good-business-wrong-money": (
        "matching-business-to-instrument-2026", "Matching the Business to the Instrument",
        "Report 2 of the Agricultural Capital series. The five archetypes, the documented "
        "case behind each one, the leverage and additionality trade off, and every source."),
    "spend-the-same-money-differently": (
        "same-budget-different-result-2026", "The Same Budget, a Different Result",
        "Report 3 of the Agricultural Capital series. The model, the five scenarios, the "
        "sensitivity tests, the full methodology and every source."),
}


def split_front(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, flags=re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip().strip('"')
    return meta, text[m.end():]


def esc(s):
    """Text escaping for JSX, leaving our own tags alone (applied before tags are added)."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;") \
            .replace("{", "&#123;").replace("}", "&#125;") \
            .replace("'", "&apos;").replace('"', "&quot;")


def inline(s):
    """Markdown inline markup to JSX, after escaping."""
    out, last = [], 0
    pattern = re.compile(r"\[([^\]]*)\]\(([^)]*)\)")
    for mo in pattern.finditer(s):
        out.append(esc(s[last:mo.start()]))
        label, url = esc(mo.group(1)), mo.group(2)
        if "herufi.org" in url:
            path = re.sub(r"^https?://herufi\.org", "", url) or "/"
            out.append(f'<Link href="{path}">{label}</Link>')
        elif url.startswith(("http://", "https://")):
            out.append(f'<a href="{url}" target="_blank" rel="noopener noreferrer">{label}</a>')
        else:
            out.append(label)
        last = mo.end()
    out.append(esc(s[last:]))
    t = "".join(out)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", t)
    return t


def convert_table(block, srcnote):
    rows = [r.strip().strip("|").split("|") for r in block.splitlines() if r.strip().startswith("|")]
    rows = [[c.strip() for c in r] for r in rows]
    rows = [r for r in rows if not all(re.fullmatch(r":?-{2,}:?", c) for c in r)]
    head, body = rows[0], rows[1:]
    out = ['<div className="tablewrap"><table><thead><tr>']
    out += [f"<th>{inline(c)}</th>" for c in head]
    out.append("</tr></thead><tbody>")
    for r in body:
        cells = []
        for i, c in enumerate(r):
            cls = ' className="num"' if i and re.search(r"\d", c) else ""
            cells.append(f"<td{cls}>{inline(c)}</td>")
        out.append("<tr>" + "".join(cells) + "</tr>")
    out.append("</tbody></table></div>")
    if srcnote:
        out.append(f'<p className="srcnote">{inline(srcnote)}</p>')
    return "\n        ".join(out)


def convert(body, used):
    blocks = [b.strip() for b in body.split("\n\n") if b.strip()]
    out, i = [], 0
    while i < len(blocks):
        b = blocks[i]
        if b.startswith("!["):
            key = re.search(r"/([0-9]{2}_[a-z_]+)\.png", b).group(1)
            fig = FIGURE_MAP[key]
            used.append(fig)
            out.append(f"<BlogFigure data={{{fig} as FigureData}} />")
            # the italic caption that follows, minus its link to the standalone version
            if i + 1 < len(blocks) and blocks[i + 1].startswith("*Figure"):
                cap = blocks[i + 1].strip("*")
                cap = re.sub(r"\s*\[[^\]]*\]\([^)]*\)\.?", "", cap).strip()
                cap = re.sub(r"^Figure (\d+)\.", r"Figure \1:", cap)
                out.append(f"<blockquote>{inline(cap)}</blockquote>")
                i += 1
        elif b.startswith("|"):
            note = None
            if i + 1 < len(blocks) and re.fullmatch(r"\*[^*].*\*", blocks[i + 1], flags=re.S):
                note = blocks[i + 1].strip("*")
                i += 1
            out.append(convert_table(b, note))
        elif b == "---":
            out.append("<hr />")
        elif b.startswith("## "):
            out.append(f"<h2>{inline(b[3:].strip())}</h2>")
        elif b.startswith("### "):
            out.append(f"<h3>{inline(b[4:].strip())}</h3>")
        elif any(l.lstrip().startswith("- ") for l in b.splitlines()):
            # A block may open with a label line and then run into its list, which is how
            # the grouped source lists are written. Split the two rather than flattening
            # the bullets into the paragraph.
            lines = b.splitlines()
            first_item = next(i for i, l in enumerate(lines) if l.lstrip().startswith("- "))
            lead = " ".join(x.strip() for x in lines[:first_item]).strip()
            if lead:
                bare = lead.strip("*")
                if lead.startswith("**") and lead.endswith("**") and "**" not in bare:
                    out.append(f"<h3>{inline(bare)}</h3>")
                else:
                    out.append(f"<p>{inline(lead)}</p>")
            items = "".join(f"<li>{inline(x.strip()[2:].strip())}</li>"
                            for x in lines[first_item:] if x.strip().startswith("- "))
            out.append(f"<ul>{items}</ul>")
        else:
            out.append(f"<p>{inline(b.replace(chr(10), ' '))}</p>")
        i += 1
    return out


def build(src_dir):
    for fname, slug, component in ARTICLES:
        raw = open(os.path.join(src_dir, fname + ".md")).read()
        meta, body = split_front(raw)
        used = []
        nodes = convert(body, used)

        imports = "\n".join(
            f"import {f} from '@/data/charts/{f}.json'" for f in sorted(set(used),
                                                                        key=lambda x: int(x[6:])))
        pub_slug, pub_title, pub_blurb = PUBLICATION[slug]
        next_slug, next_title = SERIES_NAV[slug]
        nextcard = ""
        if next_slug:
            nextcard = (
                f'\n      <Link className="nextcard" href="/blogs/{next_slug}">\n'
                f'        <div>\n'
                f'          <span className="eyebrow forest">Next in the series</span>\n'
                f'          <h3>{esc(next_title)}</h3>\n'
                f'        </div>\n'
                f'        <span aria-hidden="true">&rarr;</span>\n'
                f'      </Link>')

        tags = re.findall(r'"([^"]+)"', meta.get("tags", ""))
        tag_html = "".join(f'<span className="tag">{esc(t)}</span>' for t in tags)
        date = meta["date"]
        pretty = {"01": "January", "02": "February", "03": "March", "04": "April",
                  "05": "May", "06": "June", "07": "July", "08": "August",
                  "09": "September", "10": "October", "11": "November", "12": "December"}
        y, mth, d = date.split("-")
        shown = f"{int(d)} {pretty[mth]} {y}"

        prose = "\n        ".join(nodes)
        tsx = f"""import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type {{ FigureData }} from '@/components/charts/types'
{imports}

export default function {component}() {{
  return (
    <article className="article">
      <Link className="back" href="/blogs">&larr; Back to blogs</Link>
      <div className="chips"><span className="pill green">{esc(meta['pillar'])}</span><span className="pill outline">{esc(meta['category'])}</span></div>
      <h1>{esc(meta['title'])}</h1>
      <p className="summary">{esc(meta['summary'])}</p>
      <div className="meta"><span>{esc(meta['author'])}</span><span>{shown}</span><span>{esc(meta['readingTime'])}</span></div>
      <div className="prose">
        {prose}
      </div>{nextcard}
      <Link className="pubcard" href="/publications/{pub_slug}">
        <span className="eyebrow gold">Full Publication</span>
        <h3>{esc(pub_title)}</h3>
        <p>{esc(pub_blurb)}</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags">{tag_html}</div>
    </article>
  )
}}
"""
        out_tsx = os.path.join(SITE, "content", "blogs", slug + ".tsx")
        with open(out_tsx, "w") as f:
            f.write(tsx)
        print(f"wrote content/blogs/{slug}.tsx  ({len(used)} figures)")

        # The Markdown twin carries the frontmatter the listing reads. Figures and their
        # captions are dropped, matching the other series posts, because this body is only
        # a fallback: the route serves the JSX module for these slugs.
        md_body = []
        blocks = [b.strip() for b in body.split("\n\n") if b.strip()]
        skip_next = False
        for b in blocks:
            if skip_next and b.startswith("*Figure"):
                skip_next = False
                continue
            skip_next = False
            if b.startswith("!["):
                skip_next = True
                continue
            md_body.append(b)
        front = "\n".join(f'{k}: {raw.splitlines()[i+1].split(":", 1)[1].strip()}'
                          for i, k in [])  # unused, frontmatter copied verbatim below
        fm = re.match(r"^---\n.*?\n---\n", raw, flags=re.S).group(0)
        fm = fm.replace(f'slug: "{meta["slug"]}"', f'slug: "{slug}"')
        out_md = os.path.join(SITE, "content", "blog", slug + ".md")
        with open(out_md, "w") as f:
            f.write(fm + "\n" + "\n\n".join(md_body) + "\n")
        print(f"wrote content/blog/{slug}.md")


# ---------------------------------------------------------------------------
# The publication: the full research report, as a report-doc route.
# ---------------------------------------------------------------------------

# Where each figure lands. Key is the report heading it follows.
REPORT_FIGURES = {
    "1.3 The evidence": ["ag_fig2", "ag_fig1"],
    "1.4 The guarantee ceiling": ["ag_fig3"],
    "1.5 The competition for the balance sheet": ["ag_fig6"],
    "1.6 The tenor gap": ["ag_fig4"],
    "1.7 Who actually lends": ["ag_fig5"],
    "2.2 Five archetypes, five balance sheets": ["ag_fig7"],
    "2.5 The trade off nobody prices": ["ag_fig8", "ag_fig9"],
    "2.6 Who is actually the risk": ["ag_fig10"],
    "3.4 Reach": ["ag_fig12"],
    "3.5 Technically viable against durably viable": ["ag_fig11"],
    "3.6 Sensitivity": ["ag_fig13"],
    "3.7 What the Constrained scenario actually contains": ["ag_fig14"],
}

HEADLINE_STATS = [
    ("stat", "39x", "How much more the cost of making a loan varies by loan size than the "
                    "expected credit loss does"),
    ("stat gold", "0.4%", "Share of the long term agricultural finance need that is met in "
                          "Africa south of the Sahara"),
    ("stat dark", "252% / 51%", "Rise in lending to the smallest borrowers against the rise in "
                                "total lending, on a fixed concessional budget"),
    ("stat", "4.5% / 26%", "Cost of donor retrenchment against the cost of a worse macro "
                           "environment, in the same downside scenario"),
]


def report_sources(src_dir):
    """The reference list, read from the project's own machine readable bibliography."""
    import csv
    path = os.path.join(src_dir, "..", "data", "sources.csv")
    out = []
    with open(path) as f:
        for r in csv.DictReader(f):
            if not r.get("url"):
                continue
            host = re.sub(r"^https?://(www\.)?", "", r["url"]).split("/")[0]
            who = r["author"]
            title = r["title"]
            year = r.get("year", "")
            out.append((f"{who}, {title}" + (f" ({year})" if year else ""), r["url"], host))
    return out


def build_publication(src_dir):
    raw = open(os.path.join(src_dir, "..", "reports", "Agri_Capital_Matching_Report.md")).read()
    lines = raw.splitlines()
    subtitle = next(l[4:].strip() for l in lines if l.startswith("### "))

    body = raw.split("## Executive summary", 1)[1]
    exec_block, rest = body.split("## Part I.", 1)
    rest = "## Part I." + rest

    exec_nodes = convert(exec_block.strip().rstrip("-").strip(), [])

    used = []
    nodes, pending = [], None
    for b in [x.strip() for x in rest.split("\n\n") if x.strip()]:
        if b.startswith("## ") or b.startswith("### "):
            heading = b.lstrip("#").strip()
            level = 2 if b.startswith("## ") else 3
            nodes.append(f"<h{level}>{inline(heading)}</h{level}>")
            pending = REPORT_FIGURES.get(heading)
            continue
        nodes.extend(convert(b, used))
        if pending:
            for fig in pending:
                used.append(fig)
                nodes.append(f"<Figure n={{{len(used)}}} data={{{fig} as FigureData}} />")
            pending = None

    imports = "\n".join(f"import {f} from '@/data/charts/{f}.json'"
                         for f in sorted(set(used), key=lambda x: int(x[6:])))
    stats = "\n            ".join(
        f'<div className="{cls}"><div className="v">{esc(v)}</div>'
        f'<div className="l">{esc(l)}</div></div>' for cls, v, l in HEADLINE_STATS)
    refs = "\n            ".join(
        f'<li>{inline(t)} <a href="{u}" target="_blank" rel="noopener">{esc(h)}</a></li>'
        for t, u, h in report_sources(src_dir))
    exec_html = "\n            ".join(exec_nodes)
    main_html = "\n          ".join(nodes)

    tsx = f"""import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type {{ FigureData }} from '@/components/charts/types'
{imports}

export default function TheMatchingProblem2026() {{
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications &rarr;</Link>
          </div>
          <p className="eyebrow">Agricultural Capital Series &middot; Report 1</p>
          <h1>The Matching Problem</h1>
          <p className="sub">{esc(subtitle)}</p>
          <div className="byline">
            <span><b>Michael Omega</b></span>
            <span>Impact Investment and Advisory Professional, Nairobi</span>
            <span>October 2026</span>
          </div>
        </div>
      </header>

      <main>
        <div className="wrap">
          <div className="stats">
            {stats}
          </div>

          <div className="exec">
            <p className="eyebrow">Executive summary</p>
            {exec_html}
          </div>

          {main_html}

          <div className="series">
            <span className="k">The three explainers in this series</span>
            <Link href="/blogs/why-banks-turn-down-farm-loans"><span className="t">Why Banks Turn Down Farm Loans They Expect to Be Repaid</span></Link>
            <Link href="/blogs/good-business-wrong-money"><span className="t">Good Business, Wrong Money</span></Link>
            <Link href="/blogs/spend-the-same-money-differently"><span className="t">Spend the Same Money Differently</span></Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <h4>References</h4>
          <ol>
            {refs}
          </ol>
        </div>
      </footer>
    </>
  )
}}
"""
    return tsx


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=DEFAULT_SRC)
    a = ap.parse_args()
    src = os.path.abspath(a.src)
    build(src)
    agri_publication_split.split(build_publication(src))
