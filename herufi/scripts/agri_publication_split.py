"""Splits the Agricultural Capital research report into the three publications the site
serves, one per part.

Why a splitter rather than three source documents. The research project maintains one
standing report, and src/test_claims.py in that project verifies its figures against live
model output. Three hand maintained site copies would drift from it the first time a number
moved. So port_agri_articles.py renders the whole report once, in memory, and this module
cuts it into three along the part boundaries the report already has.

Everything that carries a claim is sliced out of that render verbatim: body prose, tables,
figures, findings, limitations, falsification tests and references. What is written here is
only the per report framing, which has no counterpart in the source document: the hero, the
headline statistics, the executive summary scaffolding around the findings, and the choice
of which findings, limitations, tests and references belong to which report.

Selection is by text and by URL fragment rather than by position, so a reordered source
document still splits correctly, and an assertion fires if something it expects is gone.
"""
import itertools
import os
import re

SITE = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(SITE, "content", "publications")


# References that used to point elsewhere in the same document now point at a sibling
# report. Each must match exactly once, so a reworded source fails loudly rather than
# leaving a dangling pointer on the published page.
CROSS_REFS = [
    ("The standard explanation for the gap is risk. The rest of Part I tests it.",
     "The standard explanation for the gap is risk. The rest of this report tests it."),
    ("The case recurs in Section 2.4 on currency matching and in Section 3.7 on what the "
     "Constrained scenario actually contains.",
     "The case recurs in Report 2 of this series, on currency matching, and in Report 3, on "
     "what the Constrained scenario actually contains."),
    ("That is the origination cost advantage identified in 1.3, solved commercially rather "
     "than financially.",
     "That is the origination cost advantage identified in Section 1.3, solved commercially "
     "rather than financially."),
    ("Section 1.5 established the mechanism; this quantifies it.",
     "Report 1 of this series established the mechanism in its Section 1.5; this quantifies "
     "it."),
]


def rewrite_cross_refs(tsx):
    for old, new in CROSS_REFS:
        assert tsx.count(old) == 1, f"cross reference not found once: {old[:60]!r}"
        tsx = tsx.replace(old, new)
    return tsx


# --------------------------------------------------------------------------- parsing
def _trim(block):
    """Drop a trailing horizontal rule: it separated parts inside one document."""
    return re.sub(r"\s*<hr />\s*$", "", block).rstrip()


def _between(tsx, start, end):
    a = tsx.index(start)
    b = tsx.index(end, a + len(start))
    return _trim(tsx[a:b])


def _lines(block, pattern):
    return [l.strip() for l in block.split("\n") if re.match(pattern, l.strip())]


def _pick(items, keys, label):
    """Select items by a distinctive substring, preserving source order."""
    out = []
    for item in items:
        if any(k in item for k in keys):
            out.append(item)
    for k in keys:
        hits = [i for i in items if k in i]
        assert len(hits) == 1, f"{label}: {k!r} matched {len(hits)} items"
    assert len(out) == len(keys), f"{label}: selected {len(out)} of {len(keys)}"
    return out


def parse(tsx):
    """Break the rendered report into the pieces the three publications are built from."""
    exec_block = _between(tsx, '<div className="exec">', "</div>")
    doc = {
        "part1": _between(tsx, "<h2>Part I.", "<h2>Part II."),
        "part2": _between(tsx, "<h2>Part II.", "<h2>Part III."),
        "part3": _between(tsx, "<h2>Part III.", "<h2>Part IV."),
        "part4": _between(tsx, "<h2>Part IV.", "<h2>Appendix A."),
        "method": _lines(_between(tsx, "<h2>Appendix A.", "<h2>Appendix B."), r"^<p>"),
        "limits": _lines(_between(tsx, "<h2>Appendix B.", "<h2>Appendix C."), r"^<p>\d+\."),
        "falsify": re.findall(r"<li>(.*?)</li>", _between(tsx, "<h2>Appendix C.", "<hr />")),
        "findings": _lines(exec_block, r"^<p>\d+\. <strong>"),
        "recommendation": next(l.strip() for l in exec_block.split("\n")
                               if "<strong>The recommendation</strong>" in l),
        "refs": _lines(tsx[tsx.index("<h4>References</h4>"):], r"^<li>"),
    }
    for k in ("part1", "part2", "part3", "part4"):
        assert doc[k].startswith("<h2>Part "), f"{k} did not slice cleanly"
    assert len(doc["findings"]) == 10, len(doc["findings"])
    assert len(doc["limits"]) == 8, len(doc["limits"])
    assert len(doc["falsify"]) == 4, len(doc["falsify"])
    assert len(doc["refs"]) > 20, len(doc["refs"])
    return doc


# ------------------------------------------------------------------------ assembling
def _renumber(block):
    """A part becomes a report of its own: drop the part numbering, restart the figures."""
    block = re.sub(r"^<h2>Part [IV]+\. ", "<h2>", block)
    counter = itertools.count(1)
    return re.sub(r"<Figure n=\{\d+\}", lambda m: f"<Figure n={{{next(counter)}}}", block)


def _figures(block):
    """The chart modules this part actually uses, in first appearance order."""
    found = re.findall(r"data=\{(ag_fig\d+) as FigureData\}", block)
    return list(dict.fromkeys(found))


def _renumbered_list(items):
    """Renumber a numbered appendix list so each report reads 1..n."""
    return [re.sub(r"^<p>\d+\. <strong>", f"<p>{i}. <strong>", item, count=1)
            for i, item in enumerate(items, start=1)]


def _finding(doc, key, number):
    item = _pick(doc["findings"], [key], "finding")[0]
    return re.sub(r"^<p>\d+\. <strong>", f"<p>{number}. <strong>", item, count=1)


def reports(doc):
    """The three publications, in series order."""
    f = lambda key, n: _finding(doc, key, n)
    return [
        dict(
            slug="cost-of-a-small-loan-2026",
            component="CostOfASmallLoan2026",
            number=1,
            title="The Cost of a Small Loan",
            sub="Why Africa&apos;s agricultural lending gap behaves like a cost problem "
                "and is priced as a risk problem",
            stats=[
                ("", "39x", "How much more the cost of making a loan varies by loan size "
                            "than the expected credit loss does"),
                ("gold", "0.4%", "Share of the long term agricultural finance need that is "
                                 "met in Africa south of the Sahara"),
                ("dark", "23 to 1", "Operating cost against expected credit loss on the "
                                    "smallest loans a commercial bank makes"),
                ("", "43bn / 2bn", "Annual smallholder finance supplied by agribusiness "
                                   "buyers against the amount supplied by commercial banks"),
            ],
            opening=[
                "<p>Agriculture is roughly a fifth of value added and more than half of all "
                "employment across Kenya, Tanzania, Uganda, Rwanda and Zambia. It receives "
                "about 4 per cent of commercial bank lending. This report asks why, and "
                "tests the explanation the sector gives for it.</p>",
                "<p><strong>The diagnosis is that agriculture&apos;s capital problem is "
                "misdiagnosed.</strong> It is treated as a risk problem, and the instruments "
                "built for it are therefore risk instruments. The only decomposed loan level "
                "data that exists for African agricultural lending says the binding "
                "constraint at the bottom of the market is something else.</p>",
            ],
            findings=[f("Credit loss barely varies by loan size", 1),
                      f("The dominant instrument is capped by arithmetic", 2),
                      f("The gap has a tenor shape", 3),
                      f("largest financier of smallholder agriculture is the buyer", 4)],
            closing=[
                "<p><strong>What follows from this.</strong> Report 2 takes the cost "
                "structure established here and asks what kind of capital fits an "
                "agricultural balance sheet. Report 3 models what changes when a fixed "
                "concessional budget is spent on the cost of lending rather than on cover "
                "against losses.</p>",
            ],
            body=[doc["part1"]],
            method=[
                "<p><strong>Source of the cost decomposition.</strong> Aceli Africa, working "
                "with Dalberg, publishes a standardised profit and loss for agricultural SME "
                "lending across five ticket bands. Every band reproduced in this report "
                "reconciles exactly against that published net margin, so the decomposition "
                "here introduces no estimate of its own.</p>",
            ] + _pick(doc["method"], ["<strong>Cost curve.</strong>"], "method"),
            limits=_pick(doc["limits"], [
                "One programme, five countries, one vintage",
                "Five observations in the cost curve",
                "Selection bias runs one way",
                "Two different markets",
            ], "limits"),
            falsify=_pick(doc["falsify"], [
                "Expected credit loss proving strongly size dependent",
                "A pure guarantee facility demonstrably moving lending",
            ], "falsify"),
            refs=[
                "Aceli-2025-Financial-Benchmarking-Report-Final.pdf",
                "Activating-the-Agri-SME-Finance-Market-Report.pdf",
                "Aceli-Africa-2023-Benchmarking-Report.pdf",
                "ISF_AgFinance-SoS-Report-Oct-2025.pdf",
                "2025-africa-tech-venture-capital-report",
                "briterbridges.com/",
                "the-state-of-the-agri-sme-sector-bridging-the-finance-gap",
                "aceli-africa-mobilising-private-capital",
                "financing-smes-into-global-value-chains",
                "world-development-indicators",
                "uganda-raises-interest-rate-to-12",
                "bou-takes-action-on-falling-shilling",
            ],
            blog=("/blogs/why-banks-turn-down-farm-loans",
                  "Why Banks Turn Down Farm Loans They Expect to Be Repaid"),
        ),
        dict(
            slug="matching-business-to-instrument-2026",
            component="MatchingBusinessToInstrument2026",
            number=2,
            title="Matching the Business to the Instrument",
            sub="Five agricultural business models, the balance sheet each one has, and the "
                "capital each one is offered",
            stats=[
                ("", "1 of 5", "Agricultural business archetypes with the economics venture "
                               "equity requires"),
                ("gold", "76%", "Fall in African agritech equity from its 2022 peak, while "
                                "debt reached 41 per cent of all African technology funding"),
                ("dark", "29x / 8%", "Leverage on the largest loans against the share of "
                                     "borrowers there who have never held a formal loan"),
                ("", "3.3% / 4.6%", "Non performing loans at women owned enterprises against "
                                    "enterprises owned by men over 35"),
            ],
            opening=[
                "<p>Report 1 of this series established that the binding constraint at the "
                "bottom of the agricultural lending market is the cost of making a loan "
                "rather than the risk of losing it. This report asks the question that "
                "follows. Given that cost structure, what kind of capital fits an "
                "agricultural business, and what is it usually offered instead?</p>",
                "<p><strong>The capital that is most available fits the part of the sector "
                "that matters least for the outcome the sector says it wants.</strong> Of the "
                "five agricultural business archetypes set out here, one has venture "
                "economics. It is also the smallest part of the sector by revenue and the "
                "most indirectly connected to farmer incomes.</p>",
            ],
            findings=[f("Agritech equity fell about 76 per cent", 1),
                      f("Leverage and additionality are the same fact", 2),
                      f("Women and young borrowers are the better credit", 3),
                      "<p>4. <strong>Part of the constraint is a shortage of structurers "
                      "rather than a shortage of capital.</strong> The two transactions in "
                      "this report that financed a balance sheet as the framework prescribes "
                      "were structured by the same intermediary, and both were reported as "
                      "firsts of their kind. A balance sheet with nobody able to build its "
                      "instrument takes the instrument already on the shelf.</p>"],
            closing=[
                "<p><strong>What follows from this.</strong> Report 3 holds the concessional "
                "budget fixed and models what happens to volume and to reach when it is "
                "reallocated from cover against credit losses to the cost of origination.</p>",
            ],
            body=[doc["part2"]],
            method=[
                "<p><strong>How the archetypes were built.</strong> The five archetypes are a "
                "reading of what agricultural enterprises hold on their balance sheets, set "
                "against what venture equity requires. They are a framework for matching an "
                "instrument to an asset, not a taxonomy with a claim to completeness, and a "
                "real company can sit in two of them at once.</p>",
                "<p><strong>How the cases were selected and read.</strong> Each case is a "
                "dated, publicly reported event at a named company, chosen because the "
                "company is a clear instance of its archetype. Attribution is deliberately "
                "weak. None of these companies succeeded or failed for one reason, none "
                "publishes audited profit figures, and no causal claim is made from a "
                "financing structure to an outcome.</p>",
            ],
            limits=_pick(doc["limits"], [
                "One programme, five countries, one vintage",
                "No view on any individual company or fund",
            ], "limits") + [
                "<p>3. <strong>The loan performance comparison sits inside a screen.</strong> "
                "Aceli&apos;s figures come from loans actually issued to borrowers who passed "
                "a credit screen. The comparison by sex and age therefore says which screened "
                "borrowers performed better, not how the unscreened population would "
                "perform.</p>",
            ],
            falsify=_pick(doc["falsify"], [
                "A sharp recovery in agritech equity returns",
            ], "falsify") + [
                "An agricultural processor or input distributor delivering venture scale "
                "equity returns, which would mean the balance sheet reading here is wrong.",
            ],
            refs=[
                "Aceli-2025-Financial-Benchmarking-Report-Final.pdf",
                "Activating-the-Agri-SME-Finance-Market-Report.pdf",
                "state-of-blended-finance-2026",
                "2025-africa-tech-venture-capital-report",
                "briterbridges.com/",
                "african-agtech-funding-landscape-2025",
                "agritech-funding-in-africa-falls-to-168-million",
                "agfunder.com/research",
                "Blended-Finance-for-Local-Currency-Solutions-1.pdf",
                "unlocking-local-currency-financing",
                "how-to-fill-africas-missing-middle",
                "why-african-startups-stall",
                "who-writes-the-cheques-african-vc",
                "twiga-foods-enters-administration",
                "twiga-foods-creates-holdco",
                "twiga-foods-layoffs",
                "iprocure-under-administration",
                "impactalpha.com/kenyas-iprocure",
                "apollo-agriculture-completes-kenya",
                "apollo-agriculture-securitization-tranche",
                "sunculture-closes-10m-securitisation",
                "sunculture-taps-bridgin",
                "pula-raises-20m-series-b",
                "agri-insurer-pula-closes",
                "uganda-raises-interest-rate-to-12",
                "bou-takes-action-on-falling-shilling",
            ],
            blog=("/blogs/good-business-wrong-money", "Good Business, Wrong Money"),
        ),
        dict(
            slug="same-budget-different-result-2026",
            component="SameBudgetDifferentResult2026",
            number=3,
            title="The Same Budget, a Different Result",
            sub="A lender allocation model run across five scenarios, holding the "
                "concessional budget fixed",
            stats=[
                ("", "252% / 51%", "Rise in lending to the smallest borrowers against the "
                                   "rise in total lending, on a fixed concessional budget"),
                ("gold", "1.722", "Concessional points per dollar lent, held identical across "
                                  "the three scenarios the comparison rests on"),
                ("dark", "4.65% / 0.55%", "Margin on the smallest loans from a lower cost "
                                          "structure against the margin from a larger subsidy"),
                ("", "4.5% / 26%", "Cost of donor retrenchment against the cost of a worse "
                                   "macro environment, in the same downside scenario"),
            ],
            opening=[
                "<p>Reports 1 and 2 of this series established the cost structure of "
                "agricultural lending and the mismatch between agricultural balance sheets "
                "and the instruments offered to them. This report holds the concessional "
                "budget fixed and asks what changes when that budget is spent "
                "differently.</p>",
                "<p><strong>The model is structural rather than statistical, by "
                "necessity.</strong> No public deal level database exists for African "
                "agricultural finance. Rather than fit an equation to absent data, this model "
                "fits the published lender cost function and builds an allocation rule on it, "
                "then runs five scenarios, three of which spend the same concessional budget "
                "to the decimal place.</p>",
            ],
            findings=[f("The scenario modelling produces a result", 1),
                      f("difference between technically viable and durably viable", 2),
                      f("Most of the downside in the worst case is macroeconomic", 3)],
            closing=[doc["recommendation"]],
            body=[doc["part3"], doc["part4"]],
            method=doc["method"],
            limits=_pick(doc["limits"], [
                "One programme, five countries, one vintage",
                "Five observations in the cost curve",
                "The allocation parameter is calibrated, not estimated",
                "The 30 per cent operating cost reduction is an assumption",
                "Selection bias runs one way",
                "The model is supply side",
            ], "limits"),
            falsify=_pick(doc["falsify"], [
                "Origination cost proving irreducible in practice",
                "A pure guarantee facility demonstrably moving lending",
            ], "falsify"),
            refs=[
                "Aceli-2025-Financial-Benchmarking-Report-Final.pdf",
                "Activating-the-Agri-SME-Finance-Market-Report.pdf",
                "state-of-blended-finance-2026",
                "aceli-africa-mobilising-private-capital",
                "agdevco_annual_report_2025.pdf",
                "how-to-fill-africas-missing-middle",
                "world-development-indicators",
                "uganda-raises-interest-rate-to-12",
                "bou-takes-action-on-falling-shilling",
            ],
            blog=("/blogs/spend-the-same-money-differently",
                  "Spend the Same Money Differently"),
        ),
    ]


def render(r, siblings, doc):
    body = "\n          <hr />\n          ".join(_renumber(b)
                                                  for b in r["body"])
    figs = _figures(body)
    imports = "\n".join(f"import {n} from '@/data/charts/{n}.json'" for n in figs)

    stats = "\n".join(
        f'            <div className="stat{(" " + k) if k else ""}">'
        f'<div className="v">{v}</div><div className="l">{l}</div></div>'
        for k, v, l in r["stats"])

    summary = (r["opening"] + ["<p><strong>Key findings</strong></p>"]
               + r["findings"] + r["closing"])
    summary = "\n".join(f"            {p}" for p in summary)

    limits = "\n".join(f"          {p}" for p in _renumbered_list(r["limits"]))
    method = "\n".join(f"          {p}" for p in r["method"])
    falsify = "".join(f"<li>{p}</li>" for p in r["falsify"])

    cards = "\n".join(
        f'            <Link href="/publications/{s["slug"]}">'
        f'<div className="k">Report {s["number"]} of the series</div>'
        f'<div className="t">{s["title"]}: {s["sub"][0].lower()}{s["sub"][1:]} &rarr;</div>'
        f'</Link>' for s in siblings)

    refs = "\n".join(f"            {ref}" for ref in _pick(doc["refs"], r["refs"], "refs"))
    blog_url, blog_title = r["blog"]
    method_heading = "Appendix A. Methodology" if r["number"] == 3 else "Appendix A. Method"

    return f"""import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type {{ FigureData }} from '@/components/charts/types'
{imports}

export default function {r["component"]}() {{
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications &rarr;</Link>
          </div>
          <p className="eyebrow">Agricultural Capital Series &middot; Report {r["number"]} of 3</p>
          <h1>{r["title"]}</h1>
          <p className="sub">{r["sub"]}</p>
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
{summary}
          </div>

          {body}
          <hr />
          <h2>{method_heading}</h2>
{method}
          <h2>Appendix B. Limitations</h2>
{limits}
          <h2>Appendix C. What would falsify this</h2>
          <ul>{falsify}</ul>
          <hr />
          <p><em>A shorter explainer of this report is published as <Link href="{blog_url}">{blog_title}</Link>. Sources are listed in full in SOURCES.md. Data, model and notebooks are open and reproducible.</em></p>

          <div className="series">
{cards}
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


def split(combined_tsx):
    doc = parse(rewrite_cross_refs(combined_tsx))
    rs = reports(doc)
    for r in rs:
        siblings = [s for s in rs if s["slug"] != r["slug"]]
        path = os.path.join(OUT, r["slug"] + ".tsx")
        with open(path, "w") as fh:
            fh.write(render(r, siblings, doc))
        print(f"wrote content/publications/{r['slug']}.tsx  "
              f"({len(_figures(''.join(r['body'])))} figures, {len(r['refs'])} references)")
