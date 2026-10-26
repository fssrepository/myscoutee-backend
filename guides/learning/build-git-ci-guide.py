#!/usr/bin/env python3
"""Editable content and vector artwork for the Git / CI learning guide.

Run from any directory with Python 3, ReportLab and DejaVu fonts installed.
This standalone learning document does not use the English product-manual
catalog, whose build also publishes product manuals into the frontend.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'MyScoutee_Git_Workflows_and_CI_Runners_EN.pdf'
FONT_ROOT = Path('/usr/share/fonts/truetype/dejavu')
for name, file in [('Body', 'DejaVuSans.ttf'), ('Bold', 'DejaVuSans-Bold.ttf'),
                   ('Mono', 'DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_ROOT / file)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold', italic='Body', boldItalic='Bold')

W, H = A4
M, CW = 43, W - 86
INK = colors.HexColor('#183047')
MUTED = colors.HexColor('#53697C')
BLUE = colors.HexColor('#245CC5')
TEAL = colors.HexColor('#087E80')
GOLD = colors.HexColor('#A86612')
PALE = colors.HexColor('#F0F5FA')
LINE = colors.HexColor('#D5DFE9')
STYLES = {
    'body': ParagraphStyle('body', fontName='Body', fontSize=10.2, leading=15.5, textColor=INK),
    'small': ParagraphStyle('small', fontName='Body', fontSize=8.3, leading=12, textColor=MUTED),
    'cell': ParagraphStyle('cell', fontName='Body', fontSize=9, leading=13, textColor=INK),
    'box': ParagraphStyle('box', fontName='Body', fontSize=9.2, leading=13, alignment=TA_CENTER, textColor=INK),
    'code': ParagraphStyle('code', fontName='Mono', fontSize=9, leading=14, textColor=INK),
}
# Stable publication timestamp, including reproducible PDF metadata.
os.environ['SOURCE_DATE_EPOCH'] = '1792886400'  # 2026-10-25 00:00 UTC
c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1, invariant=1)
c.setTitle('Git Workflows and CI Runners | MyScoutee Learning')
c.setAuthor('MyScoutee')
c.setSubject('Branching strategies, GitLab runner scope, executors and concurrency')
c.setKeywords('Git, GitHub Flow, GitLab Flow, Gitflow, trunk-based, runners, concurrency')
y = 0
page_number = 0


def p(text, style='body', gap=10):
    global y
    para = Paragraph(text, STYLES[style])
    _, height = para.wrap(CW, H)
    if y - height < 55:
        raise ValueError(f'Page {page_number} overflows: {text[:70]}')
    para.drawOn(c, M, y - height)
    y -= height + gap


def heading(text):
    global y
    y -= 8
    c.setFillColor(INK)
    c.setFont('Bold', 13)
    c.drawString(M, y, text)
    y -= 23


def page(kicker, title, subtitle):
    global y, page_number
    if page_number:
        c.showPage()
    page_number += 1
    c.setFillColor(TEAL)
    c.rect(M, H - 43, 30, 4, fill=1, stroke=0)
    c.setFont('Bold', 8)
    c.drawString(M + 40, H - 42, 'MYSCOUTEE / LEARNING')
    c.setFillColor(MUTED)
    c.setFont('Body', 8)
    c.drawRightString(W - M, H - 42, kicker.upper())
    c.setStrokeColor(LINE)
    c.line(M, 43, W - M, 43)
    c.setFont('Body', 7.5)
    c.drawString(M, 29, 'Git workflows & CI runners  |  v1.0.0  |  25 October 2026')
    c.drawRightString(W - M, 29, f'{page_number:02d} / 10')
    c.bookmarkPage(f'page-{page_number}')
    c.addOutlineEntry(title, f'page-{page_number}', level=0)
    y = H - 90
    title_para = Paragraph(title, ParagraphStyle('title', fontName='Bold', fontSize=27, leading=33, textColor=INK))
    _, height = title_para.wrap(CW, H)
    title_para.drawOn(c, M, y - height)
    y -= height + 12
    p(subtitle, 'small', 21)


def table(rows, widths):
    global y
    data = [[Paragraph(str(v), STYLES['cell']) for v in row] for row in rows]
    t = Table(data, colWidths=[CW * v for v in widths], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PALE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('RIGHTPADDING', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LINEBELOW', (0, 0), (-1, -1), .5, LINE),
    ]))
    _, height = t.wrap(CW, H)
    if y - height < 55:
        raise ValueError(f'Table overflow on page {page_number}')
    t.drawOn(c, M, y - height)
    y -= height + 16


def box(x, top, width, height, text, accent=BLUE):
    c.setFillColor(PALE)
    c.setStrokeColor(LINE)
    c.roundRect(x, top - height, width, height, 7, stroke=1, fill=1)
    c.setFillColor(accent)
    c.roundRect(x, top - height, 3, height, 1, fill=1, stroke=0)
    para = Paragraph(text, STYLES['box'])
    _, ph = para.wrap(width - 16, height)
    if ph > height - 8:
        raise ValueError(f'Box overflow: {text}')
    para.drawOn(c, x + 8, top - (height + ph) / 2)


def arrow(x1, y1, x2, y2, color=BLUE):
    import math
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(1.4)
    c.line(x1, y1, x2, y2)
    angle = math.atan2(y2 - y1, x2 - x1)
    a = c.beginPath()
    a.moveTo(x2, y2)
    for d in [-.45, .45]:
        a.lineTo(x2 - 6 * math.cos(angle + d), y2 - 6 * math.sin(angle + d))
    a.close()
    c.drawPath(a, fill=1, stroke=0)


def flow(labels, caption, accent=BLUE, linked=True):
    global y
    n, gap, bh = len(labels), 17, 54
    width = (CW - (n - 1) * gap) / n
    for i, label in enumerate(labels):
        x = M + i * (width + gap)
        box(x, y, width, bh, label, accent)
        if linked and i < n - 1:
            arrow(x + width + 2, y - bh / 2, x + width + gap - 2, y - bh / 2, accent)
    y -= bh + 9
    p(caption, 'small', 15)


def note(title, text):
    p(f'<b>{title}</b> {text}')


def code(text):
    global y
    lines = text.splitlines()
    h = len(lines) * 14 + 20
    if y - h < 55:
        raise ValueError(f'Code overflow on page {page_number}')
    c.setFillColor(PALE)
    c.roundRect(M, y - h, CW, h, 6, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont('Mono', 8.7)
    for i, line in enumerate(lines):
        if pdfmetrics.stringWidth(line, 'Mono', 8.7) > CW - 24:
            raise ValueError(f'Code line too wide: {line}')
        c.drawString(M + 12, y - 18 - i * 14, line)
    y -= h + 14


page('01 / The map', 'Git workflows<br/>&amp; CI runners',
     'An illustrated comparison for MyScoutee Backend. English learning guide, based on the two shared conversations and primary documentation. [1-2]')
p('A branching strategy organizes <b>how code changes meet</b>. A pipeline describes <b>what work to run</b>. A runner provides <b>where that work executes</b>. You can change one without automatically changing the others.')
flow(['<b>Branch / PR / MR</b><br/>Integrate code', '<b>Pipeline / jobs</b><br/>Build and check', '<b>Runner + executor</b><br/>Execute work'],
     'Figure 1. Three decisions in one delivery system. Arrows show the conceptual work flow, not Git merge edges.')
table([
    ['<b>Question</b>', '<b>Mechanism</b>', '<b>Read</b>'],
    ['When and where do changes merge?', 'Gitflow, GitHub Flow, GitLab Flow, trunk-based development', '2-4'],
    ['How do teams contribute and release?', 'Feature/release/environment branches, forks, GitOps, Ship/Show/Ask', '5'],
    ['Which projects and machines can run a job?', 'Runner scope, tags and executors', '6'],
    ['How many jobs exist, and how many run?', 'parallel, concurrent, limit, request_concurrency', '7-8'],
    ['How does this relate to this repository?', 'MyScoutee ownership and examples', '9'],
    ['Where can I verify the details?', 'Sources and reading paths', '10'],
], [.46, .43, .11])
note('Vocabulary.', 'PR means pull request; MR means merge request. Both propose integrating changes. The diagrams use <b>main</b> generically; this repository uses <b>master</b>.')
note('Document status.', 'Educational guidance, not a new repository policy or a report of live runner settings. Examples are illustrative; no runner or deployment configuration is changed by this guide.')

page('02 / Compare', 'Four integration models',
     'Compare the integration point and release process before choosing branch names. [3-7]')
table([
    ['<b>Model</b>', '<b>Integration and release</b>', '<b>Trade-off / useful context</b>'],
    ['<b>Gitflow</b>', 'Features merge into develop. A release branch stabilizes a version; main records releases.', 'Explicit release preparation, with more branches and merge paths. Useful for scheduled, versioned releases.'],
    ['<b>GitHub Flow</b>', 'Short branches propose changes to the default branch through PRs.', 'Simple collaboration structure. Release and deployment gates still need to be defined.'],
    ['<b>GitLab Flow</b>', 'Feature branches merge into main; environment or stable-version branches may extend the flow.', 'Models release constraints explicitly, with extra synchronization when extra branches are used.'],
    ['<b>Trunk-based</b>', 'Small changes integrate into one trunk frequently; short-lived branches and review are compatible.', 'Early integration feedback; needs fast checks, small slices and prompt review.'],
], [.19, .41, .40])
heading('The same feature, four routes')
flow(['<b>Gitflow</b><br/>feature', 'develop', 'release', 'main + tag'], 'Figure 2a. Release fixes also return to develop; see the full diagram on page 3.')
flow(['<b>GitHub Flow</b><br/>feature', 'PR + checks', 'main'], 'Figure 2b. Deployment is a separately defined step after, or around, integration.')
flow(['<b>GitLab Flow</b><br/>feature', 'MR + main', 'production'], 'Figure 2c. One environment-branch variant; production is not mandatory in every variant.')
p('<b>Trunk-based:</b> several small changes enter main throughout development, instead of waiting for the entire feature. GitHub-style PRs can implement this when they remain short-lived.', 'small')

page('03 / Gitflow', 'Separate development<br/>from release preparation',
     'Original Gitflow roles, drawn as conceptual merge paths rather than an exact commit graph. [3]')
top = y
box(M, top, 145, 52, '<b>feature/*</b><br/>New work')
box(M + 182, top, 145, 52, '<b>develop</b><br/>Next version')
box(M + 364, top, 145, 52, '<b>release/*</b><br/>Stabilize')
arrow(M + 147, top - 26, M + 180, top - 26)
arrow(M + 329, top - 26, M + 362, top - 26)
box(M + 182, top - 145, 145, 52, '<b>main + tag</b><br/>Released version', TEAL)
box(M, top - 145, 145, 52, '<b>hotfix/*</b><br/>Urgent repair', GOLD)
arrow(M + 436, top - 54, M + 290, top - 142, TEAL)
arrow(M + 403, top - 54, M + 310, top - 54, TEAL)
c.setFont('Body', 8)
c.setFillColor(MUTED)
c.drawString(M + 330, top - 71, 'fixes back')
arrow(M + 180, top - 162, M + 147, top - 162, GOLD)
arrow(M + 147, top - 184, M + 180, top - 184, GOLD)
arrow(M + 76, top - 143, M + 208, top - 55, GOLD)
y = top - 220
p('Figure 3. Blue: feature delivery. Teal: release completion and fixes returned to development. Gold: hotfix branches from main and returns to main and develop.', 'small', 18)
p('<b>feature/*</b> starts from develop and returns there. <b>release/*</b> starts from develop, stabilizes the next version, then merges into main and develop. Tag the release on main.')
p('<b>hotfix/*</b> starts from the released main line. Merge the repair into main and back into development; if a release branch is active, incorporate it there so the next release retains the fix.')
note('Benefit.', 'Release stabilization can proceed while development of the next version continues.')
note('Cost.', 'More long-lived lines create more synchronization work and opportunities to miss a back-merge.')
note('When to consider it.', 'A deliberate release train with version support requirements. The original author later recommended simpler flows for continuously delivered web applications.')

page('04 / Integration cadence', 'GitHub Flow and<br/>trunk-based development',
     'These can overlap: one describes a collaboration flow; the other emphasizes frequent integration. [4, 6-7]')
heading('GitHub Flow: propose, review, merge')
flow(['Short branch', 'PR + feedback<br/>+ checks', 'Default branch'],
     'Figure 4. The branch isolates a change while collaborators review it.')
p('Create a focused branch, commit changes, open a pull request, address feedback, then merge and remove the finished branch. Required reviews and checks come from repository configuration. A feature branch that stays open for weeks may follow this shape while accumulating substantial integration risk.')
heading('Trunk-based: integrate small slices frequently')
flow(['Slice A<br/>main', 'Slice B<br/>main', 'Slice C<br/>main', 'Enable feature'],
     'Figure 5. An illustrative feature-flag sequence. Integration and user-visible activation need not happen together.', TEAL)
p('Keep a single shared development line. Direct commits or short-lived reviewed branches can both work. Review waiting time counts toward branch lifetime. Break large features into compatible slices; feature flags or branch-by-abstraction can keep incomplete behavior inactive.')
table([
    ['<b>Dimension</b>', '<b>GitHub Flow</b>', '<b>Trunk-based emphasis</b>'],
    ['Review', 'PR discussion before merge', 'Review that keeps integration frequent'],
    ['Change size', 'Focused change', 'Small, independently safe slice'],
    ['Key failure mode', 'Long PR queue / branch drift', 'Slow or unreliable feedback on trunk'],
], [.24, .38, .38])
note('Practical interpretation.', 'The two labels are compatible when PRs integrate promptly. Neither label alone proves that production deployment is automatic or that tests are sufficient.')

page('05 / Composition', 'GitLab Flow and<br/>the patterns you combine',
     'The ten names in the conversation are not ten mutually exclusive choices. [5, 8-10]')
flow(['feature/*', 'main', 'pre-production', 'production'],
     'Figure 6. An environment-branch version of GitLab Flow. Promote fixes forward through the defined path.')
p('GitLab Flow combines feature-driven integration with issue tracking and delivery constraints. Environment branches track promotion; stable-version branches support maintained versions. Choose the extra branches for an actual release need. GitLab Runner does not require GitLab Flow.')
table([
    ['<b>Pattern</b>', '<b>What it changes</b>', '<b>How it combines / trade-off</b>'],
    ['Feature Branch Workflow', 'A separate branch holds a change.', 'Building block of several flows; long branch lifetime raises integration cost.'],
    ['Release Branching', 'A branch stabilizes or maintains a version.', 'Can supplement trunk-based development or other flows; fixes must reach every relevant line.'],
    ['Environment Branching', 'Branches represent promotion stages.', 'Can implement a GitLab Flow variant; source branches and runtime environments can drift.'],
    ['Forking Workflow', 'Contributions originate in another repository.', 'Works with PR review; changes repository ownership, not the release cadence.'],
    ['GitOps', 'Versioned desired state is pulled and continuously reconciled.', 'A delivery/operations model. Separate repositories or directories can work; environment branches are optional.'],
    ['Ship / Show / Ask', 'Chooses whether review precedes integration.', 'Ship: integrate without review. Show: integrate, then invite feedback. Ask: discuss before merging.'],
], [.24, .35, .41])
note('Example combination.', 'Short feature branches + PR review + a release branch for an older supported version + GitOps deployment can coexist. This is an illustrative composition, not an adopted MyScoutee policy.')

page('06 / Runner dimensions', 'Scope, executor and tags<br/>answer different questions',
     'A runner is registered in GitLab; its manager executes jobs using an executor. [11-14]')
table([
    ['<b>Dimension</b>', '<b>Options</b>', '<b>Question answered</b>'],
    ['Scope', 'Instance / group / project', 'Which projects can use this runner?'],
    ['Executor', 'Shell / Docker / Kubernetes, etc.', 'How is a job environment created?'],
    ['Tags', 'For example: lab-build, lab-docker', 'Which eligible runner matches the job?'],
    ['Manager / host', 'Runner process and its infrastructure', 'Where is execution capacity supplied?'],
], [.22, .39, .39])
flow(['<b>Instance</b><br/>Enabled projects', '<b>Group</b><br/>Group + subgroups', '<b>Project</b><br/>Assigned projects'],
     'Figure 7. Scope options from broad to narrow. These boxes are alternatives, not a job execution chain.', linked=False)
p('Instance runners are available across an instance subject to enablement and policy. Group runners serve projects in their group hierarchy. Project runners serve explicitly assigned projects. A project shared with a group grants member access; that invitation does not move it into the group hierarchy or automatically grant the invited group\'s runner capacity. [11, 13]')
heading('Execution isolation is a separate choice')
p('<b>Shell</b> runs commands on the host. <b>Docker</b> runs jobs in containers. <b>Kubernetes</b> provisions job pods. Their isolation and capabilities depend on configuration: a privileged container or a mounted host Docker socket changes the trust boundary. A new registration on the same host is not, by itself, a strong isolation boundary. [14]')
note('Matching.', 'A runner must have every tag requested by a job. Eligibility, protected-runner rules, availability and capacity also matter. A tag is a selector, not a security sandbox. [12]')
note('Naming.', 'The older term “shared runner” commonly refers to instance scope. “Shared project” describes access sharing. They are different uses of “shared”. [11, 13]')

page('07 / Capacity', 'One runner can execute<br/>several jobs at once',
     'Separate the amount of work from the capacity that consumes it. [15-16]')
table([
    ['<b>Setting</b>', '<b>Location</b>', '<b>Meaning</b>'],
    ['parallel', 'Pipeline YAML', 'Creates multiple job instances; does not add machines.'],
    ['concurrent', 'Manager config.toml', 'Combined running-job ceiling for this runner process.'],
    ['limit', 'One [[runners]] entry', 'Ceiling for that entry; 0 means no additional entry limit.'],
    ['request_concurrency', 'One [[runners]] entry', 'Concurrent requests for new jobs, not running-job slots.'],
], [.27, .28, .45])
code('concurrent = 4\n\n[[runners]]\n  name = "example-docker"\n  executor = "docker"\n  limit = 2\n  request_concurrency = 1')
p('Illustrative configuration fragment; registration credentials and executor-specific settings are omitted. In this example the entry can run at most <b>two</b> jobs, even though its manager allows four in total. A request limit of one does not imply only one running job. [15]')
flow(['<b>4 ready jobs</b><br/>A, B, C, D', '<b>Entry limit: 2</b><br/>A + B running', '<b>Queue</b><br/>C + D waiting'],
     'Figure 8. Simplified scheduling example: all jobs match, dependencies are satisfied and no other jobs consume slots.')
note('Computed example.', 'With limit = 0 and concurrent = 4, this entry could occupy all four slots. With two entries limited to three each under one concurrent = 4 manager, their combined ceiling is four, not six.')
p('<b>Multiple managers:</b> two independent four-slot managers have an eight-slot combined ceiling, subject to ready work and infrastructure capacity.', 'small')

page('08 / Parallel work', 'More job instances<br/>do not guarantee more speed',
     'Parallel jobs need both capacity and a real division of work. [15-17]')
code('tests:\n  stage: test\n  tags: [example-test]\n  parallel: 4\n  script:\n    - ./run-shard "$CI_NODE_INDEX" "$CI_NODE_TOTAL"')
p('Illustrative YAML: <font name="Mono">run-shard</font> is a placeholder for a test splitter you must implement or replace with your test tool\'s sharding command. GitLab supplies the index and total. Plain <font name="Mono">npm test</font> with parallel: 4 usually repeats the same suite four times unless the test setup consumes those values. [16]')
flow(['Split suite<br/>into 4 shards', '4 eligible jobs<br/>enter the queue', 'Available slots<br/>execute shards'],
     'Figure 9. Four created jobs may execute in one wave, two waves, or sequentially.')
table([
    ['<b>Need</b>', '<b>New runner?</b>'],
    ['More simultaneous jobs in the same environment', 'Not necessarily. Check manager/entry limits, ready work and host capacity first.'],
    ['A different executor or operating system', 'Usually a separate runner configuration and suitable execution infrastructure.'],
    ['A GPU or special network access', 'A dedicated configuration/pool can route suitable jobs; the tag alone supplies no hardware.'],
    ['Capacity on another host / failure domain', 'Add execution infrastructure and a manager or autoscaling arrangement.'],
    ['Deployment separated from untrusted jobs', 'Use a deliberately separate trust boundary, credentials and admission rules. A second name is insufficient.'],
], [.45, .55])
p('<b>Bottlenecks:</b> check eligibility, dependencies, locks and CPU/RAM/I/O. A resource_group deliberately serializes matching jobs within a project. [12, 17]', 'small')

page('09 / MyScoutee context', 'Apply the distinctions<br/>to this repository',
     'Repository evidence and teaching examples are kept distinct. References point to specific source revisions. [18-19]')
p('<b>Verified ownership:</b> <font name="Mono">config/ci/pipeline.yml</font> includes the shared CI pipeline through <font name="Mono">LAB_CI_PATH</font> and <font name="Mono">LAB_CI_REF</font>. The project owns product settings; the shared <b>myscoutee-ci</b> repository owns the common pipeline. The effective runner setup requires the actual pinned CI revision and deployed configuration. [18]')
table([
    ['<b>Label in shared CI</b>', '<b>Documented role</b>', '<b>Implication</b>'],
    ['lab-docker', 'Small CI validation in an unprivileged container', 'Select a suitable isolated validation environment.'],
    ['lab-build', 'Trusted native builds on the host with Docker access', 'Host access requires a trusted workload boundary.'],
], [.22, .40, .38])
p('These roles come from versioned CI documentation. The labels do not tell you the live concurrent or limit values, the number of hosts, or whether a job is currently running. [19]')
heading('Teaching example: an application change')
flow(['Short change<br/>branch', 'Review + checks', 'Default branch<br/>master'],
     'Figure 10a. An illustrative integration route, not a declaration of enforced branch protection.')
flow(['Build candidate', 'Release decision', 'Deploy decision'],
     'Figure 10b. Distinct decisions. Their ordering and gates belong to the delivery workflow.', TEAL)
p('For routine changes, short reviewable branches are a simple starting point. Add a maintained release branch only when an older supported version needs independent fixes. Keep “which source is approved”, “which artifact is released” and “where it runs” explicit. This is guidance, not a migration instruction.')
p('<b>Before changing capacity:</b> locate the owning configuration; check isolated work directories, caches and fixtures. Extra registrations do not create CPU or memory or remove shared-state conflicts.', 'small')

page('10 / Sources', 'Sources &amp; further reading',
     'Checked 25 October 2026. Original diagrams and worked examples; external sources are paraphrased. Links are clickable.')
sources = [
    ('1', 'Shared conversation: workflows and runner scopes', 'https://chatgpt.com/share/6ade4b53-01c0-83ed-9e5f-b38cc5948fed'),
    ('2', 'Shared conversation: runner concurrency', 'https://chatgpt.com/share/6ade4c16-d9d4-83ed-ab4d-3a645b6e1b44'),
    ('3', 'Vincent Driessen: A successful Git branching model', 'https://nvie.com/posts/a-successful-git-branching-model/'),
    ('4', 'GitHub Docs: GitHub flow', 'https://docs.github.com/en/get-started/using-github/github-flow'),
    ('5', 'GitLab: What is GitLab Flow?', 'https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/'),
    ('6', 'Trunk Based Development: Introduction', 'https://trunkbaseddevelopment.com/'),
    ('7', 'Trunk Based Development: Short-Lived Feature Branches', 'https://trunkbaseddevelopment.com/short-lived-feature-branches/'),
    ('8', 'GitHub Docs: About forks', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks'),
    ('9', 'OpenGitOps: Principles', 'https://opengitops.dev/'),
    ('10', 'Rouan Wilsenach: Ship / Show / Ask', 'https://martinfowler.com/articles/ship-show-ask.html'),
    ('11', 'GitLab Docs: Manage runners (scope)', 'https://docs.gitlab.com/ci/runners/runners_scope/'),
    ('12', 'GitLab Docs: Configuring runners (tags and eligibility)', 'https://docs.gitlab.com/ci/runners/configure_runners/'),
    ('13', 'GitLab Docs: Sharing projects and groups', 'https://docs.gitlab.com/user/project/members/sharing_projects_groups/'),
    ('14', 'GitLab Runner: Executors', 'https://docs.gitlab.com/runner/executors/'),
    ('15', 'GitLab Runner: Advanced configuration', 'https://docs.gitlab.com/runner/configuration/advanced-configuration/'),
    ('16', 'GitLab Docs: CI/CD YAML syntax reference, parallel', 'https://docs.gitlab.com/ci/yaml/#parallel'),
    ('17', 'GitLab Docs: Resource groups', 'https://docs.gitlab.com/ci/resource_groups/'),
    ('18', 'MyScoutee Backend: project CI include (bc9116e35)', 'https://github.com/fssrepository/myscoutee-backend/blob/bc9116e35fff8e6ec1b7dcafc605a55afd8714a1/config/ci/pipeline.yml'),
    ('19', 'MyScoutee CI: runner roles (f5d200257)', 'https://github.com/fssrepository/myscoutee-ci/blob/f5d20025796427f095cbe224713338a93c26ff90/README.md'),
]
for number, title, url in sources:
    p(f'<b>[{number}]</b> <a href="{escape(url)}" color="#245CC5">{escape(title)}</a>', 'small', 7)
heading('How to use this guide')
p('For branching, start with pages 2-5. For runner setup and throughput, start with pages 6-8. Page 9 connects the concepts to MyScoutee without prescribing a new workflow.', 'small')
p('Source snapshots describe the cited revisions. Online GitLab documentation can change; check the documentation matching your installed version before applying settings. The two conversations provide the learning questions; primary sources provide the technical reference.', 'small')

if page_number != 10:
    raise ValueError('Update the footer total when changing the page count')
c.save()
print(OUTPUT)
