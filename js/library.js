/* CodeTrail — library: in-app guides (cheat sheets) and official documentation links */
const GUIDES=[
{id:'linux',cat:'Technical cheat sheets',title:'Linux troubleshooting',sum:'The commands interviewers expect, in the order you would use them.',body:`
<h3>First 60 seconds on a slow or broken box</h3>
<pre>uptime                      # load averages vs CPU count (nproc)
dmesg -T | tail             # kernel errors: OOM kills, disk, NIC
vmstat 1 5                  # r = run queue, si/so = swapping, wa = I/O wait
iostat -xz 1 3              # per-disk %util and await
free -m                     # memory; "available" is what matters
df -h ; df -i               # space AND inodes
top / htop                  # who is using CPU and memory
ss -tulpn                   # listening ports and owning processes
journalctl -p err -b        # errors since boot</pre>
<h3>Files, disks, processes</h3>
<pre>du -xh / --max-depth=1 | sort -h      # what's filling the disk
lsof +L1                              # deleted files still held open
find /var -type f -size +100M          # big files
ps -eo pid,ppid,stat,%cpu,%mem,cmd --sort=-%cpu | head
kill -TERM PID ; kill -KILL PID        # polite, then forced
chmod 640 f ; chown app:app f ; umask  # permissions</pre>
<h3>Network</h3>
<pre>ip a ; ip r                 # addresses and routes
ping -c3 host ; traceroute host
dig +short name ; dig @8.8.8.8 name
curl -sv https://host/health          # TLS + HTTP in one
nc -zv host 5432                       # is the port reachable?
tcpdump -i eth0 port 443 -nn -c 50     # what is on the wire</pre>
<h3>Text processing</h3>
<pre>grep -E 'ERROR|WARN' app.log | tail -20
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head
sed -n '100,120p' file ; tail -f file
cut -d: -f1 /etc/passwd ; xargs -n1 ; tee</pre>
<h3>Say it like this</h3><p>"I check load, memory, disk and I/O first, then the logs for the time it started, then the network path. I change one thing at a time and write down what I saw."</p>`},
{id:'git',cat:'Technical cheat sheets',title:'Git in teams',sum:'Undo safely, branch cleanly, find the bad commit.',body:`
<pre>git status ; git log --oneline --graph -20
git switch -c feature/x            # new branch
git add -p                          # stage hunks, not whole files
git commit --amend                  # fix last commit (not pushed yet)
git rebase -i main                  # tidy commits before review (local only)
git merge --no-ff feature/x         # keep a merge record
git reset --soft HEAD~1             # undo commit, keep changes
git revert SHA                      # undo a pushed commit safely
git stash ; git stash pop
git cherry-pick SHA                 # copy one commit to this branch
git bisect start ; git bisect bad ; git bisect good v1.2   # find the breaking commit
git reflog                          # recover "lost" commits</pre>
<h3>Rules interviewers like</h3><ul><li>Never rewrite history that others have pulled; use revert.</li><li>Small PRs, one purpose each, with tests.</li><li>Protect main: required reviews and CI checks.</li><li>Merge vs rebase: merge keeps history as it happened; rebase makes it linear. Teams pick one convention.</li></ul>`},
{id:'docker',cat:'Technical cheat sheets',title:'Docker',sum:'Build small, secure images and debug running containers.',body:`
<pre>docker build -t app:1.2 .
docker run -d --name app -p 8080:8080 -e ENV=prod app:1.2
docker logs -f app ; docker exec -it app sh
docker ps -a ; docker inspect app ; docker stats
docker image prune ; docker system df</pre>
<h3>A good Dockerfile</h3>
<pre>FROM python:3.12-slim AS build
WORKDIR /src
COPY requirements.txt .
RUN pip wheel -r requirements.txt -w /wheels
COPY . .

FROM python:3.12-slim
RUN useradd -r app
COPY --from=build /wheels /wheels
RUN pip install --no-cache-dir /wheels/*
COPY --from=build /src /app
USER app
HEALTHCHECK CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8080/health')"
CMD ["python","/app/main.py"]</pre>
<ul><li>Copy dependency files before code so the layer caches.</li><li>Multi-stage builds keep compilers out of production.</li><li>Run as non-root; pin base image versions; scan images.</li><li>Exit code 137 = killed (often OOM); 143 = SIGTERM.</li></ul>`},
{id:'k8s',cat:'Technical cheat sheets',title:'kubectl & Kubernetes debugging',sum:'From "pod is broken" to root cause.',body:`
<pre>kubectl get pods -A -o wide
kubectl describe pod POD          # events: scheduling, image pulls, probes
kubectl logs POD -c CONTAINER --previous
kubectl get events --sort-by=.lastTimestamp
kubectl top pod ; kubectl top node
kubectl exec -it POD -- sh
kubectl rollout status deploy/app ; kubectl rollout undo deploy/app
kubectl auth can-i delete pods --as=system:serviceaccount:ns:sa
kubectl port-forward svc/app 8080:80
kubectl get endpoints app           # does the Service have pods?</pre>
<h3>Symptom → first check</h3>
<table><tr><th>Status</th><th>Look at</th></tr>
<tr><td>Pending</td><td>describe: Insufficient cpu/memory, taints, PVC not bound</td></tr>
<tr><td>ImagePullBackOff</td><td>image name/tag, registry auth (imagePullSecrets)</td></tr>
<tr><td>CrashLoopBackOff</td><td>logs --previous, exit code, config/secret missing, liveness probe too strict</td></tr>
<tr><td>OOMKilled</td><td>memory limit vs real usage</td></tr>
<tr><td>Running but no traffic</td><td>readiness probe, Service selector vs pod labels, endpoints, NetworkPolicy</td></tr></table>`},
{id:'tf',cat:'Technical cheat sheets',title:'Terraform',sum:'Workflow, state and the questions that follow.',body:`
<pre>terraform init        # providers + backend
terraform fmt ; terraform validate
terraform plan -out=tfplan
terraform apply tfplan
terraform state list ; terraform state show aws_s3_bucket.logs
terraform import aws_s3_bucket.logs my-bucket
terraform plan -refresh-only   # see drift</pre>
<ul><li><b>Remote state + locking</b> (e.g. S3 with locking, or Terraform Cloud) so teams share one truth and can't apply at once.</li><li><b>Modules</b> for reuse; pin module and provider versions.</li><li><b>for_each</b> over count when items can be removed (stable keys).</li><li>Never put secrets in .tf files or state in Git; mark outputs sensitive.</li><li>Drift: someone changed infra by hand — plan shows it; decide whether to import, revert or update code.</li></ul>`},
{id:'sql',cat:'Technical cheat sheets',title:'SQL for interviews',sum:'Joins, grouping, windows — the patterns that come up.',body:`
<pre>-- rows per group, only groups with more than 1
SELECT dept, COUNT(*) n FROM emp GROUP BY dept HAVING COUNT(*) > 1;

-- in A but not in B
SELECT a.* FROM a LEFT JOIN b ON b.id = a.id WHERE b.id IS NULL;

-- second highest salary (handles ties)
SELECT DISTINCT salary FROM emp ORDER BY salary DESC LIMIT 1 OFFSET 1;

-- top 1 per group with a window function
SELECT * FROM (
  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) rn FROM emp e
) t WHERE rn = 1;

-- running total
SELECT day, SUM(amount) OVER (ORDER BY day) FROM sales;</pre>
<ul><li>WHERE filters rows before grouping; HAVING filters groups.</li><li>UNION removes duplicates; UNION ALL keeps them (faster).</li><li>ROW_NUMBER vs RANK vs DENSE_RANK: ties.</li><li>Indexes speed reads, slow writes; check with EXPLAIN.</li></ul>`},
{id:'py',cat:'Technical cheat sheets',title:'Python idioms for coding rounds',sum:'Write it fast, correct and readable without help.',body:`
<pre>from collections import Counter, defaultdict, deque
import heapq, itertools, re, json

Counter(words).most_common(3)
groups = defaultdict(list); groups[k].append(v)
q = deque(); q.append(x); q.popleft()          # O(1) queue
heapq.nsmallest(3, nums) ; heapq.heappush(h, (prio, item))
sorted(items, key=lambda x: (-x[1], x[0]))      # by count desc, then name
{k: v for k, v in d.items() if v}               # dict comprehension
for i, x in enumerate(xs): ...
for a, b in zip(xs, ys): ...
with open("f.log") as f:
    for line in f: ...                         # streams big files
s[::-1] ; " ".join(parts) ; s.split()
try: ... except (KeyError, ValueError) as e: ... finally: ...</pre>
<h3>How to talk through a problem</h3><ol><li>Repeat it back; ask about input size and edge cases.</li><li>Give the brute force and its cost.</li><li>Improve with the right structure (dict, set, heap, two pointers, sliding window).</li><li>Code, then test with an example and an edge case out loud.</li><li>State time and space complexity.</li></ol>`},
{id:'net',cat:'Technical cheat sheets',title:'Networking & HTTP',sum:'OSI layers, what happens on a request, status codes.',body:`
<h3>What happens when you open https://site</h3><ol><li>DNS: browser cache → OS → resolver → root → TLD → authoritative.</li><li>TCP handshake: SYN, SYN-ACK, ACK.</li><li>TLS: certificate check, key exchange, encrypted session.</li><li>HTTP request → load balancer → app → database → response.</li></ol>
<table><tr><th>Layer</th><th>Examples</th></tr><tr><td>7 Application</td><td>HTTP, DNS, SSH</td></tr><tr><td>4 Transport</td><td>TCP (reliable, ordered), UDP (fast, no guarantee)</td></tr><tr><td>3 Network</td><td>IP, routing, ICMP</td></tr><tr><td>2 Data link</td><td>Ethernet, MAC, ARP</td></tr></table>
<h3>Ports</h3><p>22 SSH · 53 DNS · 80 HTTP · 443 HTTPS · 3306 MySQL · 5432 PostgreSQL · 6379 Redis · 6443 Kubernetes API</p>
<h3>Status codes</h3><p>200 OK · 201 Created · 204 No Content · 301/302 redirect · 304 Not Modified · 400 Bad Request · 401 not authenticated · 403 forbidden · 404 · 409 Conflict · 429 Too Many Requests · 500 server error · 502 bad gateway (upstream bad) · 503 unavailable · 504 gateway timeout (upstream slow)</p>`},
{id:'sre',cat:'Technical cheat sheets',title:'SRE maths & vocabulary',sum:'Availability, error budgets, burn rates, MTTR.',body:`
<table><tr><th>SLO</th><th>Downtime / 30 days</th></tr><tr><td>99%</td><td>7 h 12 m</td></tr><tr><td>99.9%</td><td>43 m</td></tr><tr><td>99.95%</td><td>21.6 m</td></tr><tr><td>99.99%</td><td>4.3 m</td></tr></table>
<ul><li><b>SLI</b>: what you measure (share of good requests). <b>SLO</b>: the target. <b>SLA</b>: the contract with penalties.</li><li><b>Error budget</b> = 1 − SLO. Spent → slow releases, fix reliability.</li><li><b>Burn rate</b>: how fast the budget is used; page on fast burn (e.g. 14× over 1 h), ticket on slow burn.</li><li>Serial dependencies multiply: two 99.9% services in series ≈ 99.8%.</li><li><b>MTTD / MTTR</b>: time to detect / restore. <b>Toil</b>: manual, repetitive, automatable work.</li><li>Golden signals: latency, traffic, errors, saturation. USE (resources): utilisation, saturation, errors. RED (services): rate, errors, duration.</li></ul>`},
{id:'storage',cat:'Technical cheat sheets',title:'Storage & backup maths',sum:'RAID, throughput, RPO/RTO — your home ground.',body:`
<table><tr><th>RAID</th><th>Usable (n disks)</th><th>Survives</th></tr><tr><td>0</td><td>n</td><td>0</td></tr><tr><td>1</td><td>n/2</td><td>1 per mirror</td></tr><tr><td>5</td><td>n−1</td><td>1</td></tr><tr><td>6</td><td>n−2</td><td>2</td></tr><tr><td>10</td><td>n/2</td><td>1 per mirror pair</td></tr></table>
<ul><li>Throughput = IOPS × block size (50,000 × 8 KiB ≈ 400 MB/s).</li><li>Backup window: data ÷ throughput. 1 TB in 8 h needs ≈ 35 MB/s.</li><li><b>RPO</b> = max data loss (backup interval). <b>RTO</b> = max time to restore.</li><li>3-2-1: three copies, two media, one off-site — plus one immutable/offline copy.</li><li>Snapshots aren't backups: same system, same failure domain.</li><li>Dedup ratio 10:1 means 10 TB logical stored in 1 TB physical. Encrypt after dedup, not before.</li></ul>`},
{id:'design',cat:'Interview playbooks',title:'System design: a 45-minute template',sum:'A structure you can apply to any design question.',body:`
<ol><li><b>Clarify (5 min)</b>: users, main use cases, scale (requests/s, data size, growth), latency and availability targets, what's out of scope.</li><li><b>Estimate (3 min)</b>: requests/s, storage per year, bandwidth. Say the maths out loud.</li><li><b>API & data model (5 min)</b>: key endpoints, main tables or objects.</li><li><b>High-level design (10 min)</b>: clients → load balancer → stateless services → cache → database/queue/object storage.</li><li><b>Deep dive (15 min)</b>: the hardest part — sharding, consistency, hot keys, failure handling, idempotency, backups and DR.</li><li><b>Operate it (5 min)</b>: monitoring (golden signals), SLOs, deploys (canary), alerts, runbooks, cost.</li><li><b>Wrap up</b>: trade-offs you made and what you'd do next.</li></ol>
<p>Practice set in this app: URL shortener, logs & metrics pipeline, CI/CD system, backup service, rate limiter.</p>`},
{id:'star',cat:'Interview playbooks',title:'Behavioural answers (STAR)',sum:'Structure, timing and the stories to prepare.',body:`
<ul><li><b>S</b>ituation (1–2 sentences) · <b>T</b>ask (your responsibility) · <b>A</b>ction (60% of the answer, "I" not "we") · <b>R</b>esult (number + what you learned).</li><li>Aim for 90 seconds to 2 minutes; stop and let them ask follow-ups.</li><li>Prepare 8 stories that cover: biggest achievement, failure/mistake, conflict, tight deadline, ambiguity, influencing without authority, learning fast, customer impact. One story can answer several questions.</li><li>Have a number in every result. If you don't know it, estimate honestly ("roughly half a day per cycle").</li><li>Never criticise your employer or colleagues.</li></ul><p>Your drafts are in Prep → Stories; rehearse them with the 2-minute timer.</p>`},
{id:'day',cat:'Interview playbooks',title:'Interview-day checklist',sum:'Before, during and after each round.',body:`
<h3>Day before</h3><ul><li>Re-read the job description; map each requirement to a story or skill.</li><li>Read the company's latest news/annual report and the team's product.</li><li>Prepare 3 questions to ask (Prep → Companies has a list).</li><li>Test camera, mic, network, screen-share; have a plain editor ready for coding.</li></ul>
<h3>During</h3><ul><li>Think out loud; ask clarifying questions before solving.</li><li>Stuck? Say what you know, try a smaller case, ask for a hint — silence is worse.</li><li>For production scenarios: impact first, then mitigate, then root cause.</li></ul>
<h3>After</h3><ul><li>Note every question you were asked in the app (Q&A → Reported) and the ones you struggled with.</li><li>Send a short thank-you to the recruiter.</li><li>Update your pipeline status.</li></ul>`},
{id:'neg',cat:'Interview playbooks',title:'Recruiter calls, CTC and negotiation',sum:'What to say about notice, CTC, other offers — and how to negotiate.',body:`
<h3>Recruiter screen</h3><ul><li>Have your 60-second introduction, notice period, current location, preferred location, and expected range ready.</li><li>Ask: team, level/band, interview rounds, timeline, work model.</li></ul>
<h3>CTC conversation</h3><ul><li>Know your current CTC breakdown (fixed, variable, benefits) — it may be verified.</li><li>Give a researched range for the role, not a percentage hike. Let them anchor first if possible.</li><li>Fixed pay matters most; variable is uncertain.</li></ul>
<h3>After the offer</h3><ol><li>Thank them, show enthusiasm, ask for the full breakdown in writing.</li><li>Ask once, with a specific number and a reason (market data, competing offer, scope).</li><li>Negotiate the package: level, fixed, joining bonus (to offset notice buy-out), start date.</li><li>Get the final offer in writing before resigning.</li></ol>`},
{id:'resume',cat:'Interview playbooks',title:'Resume & LinkedIn checklist',sum:'What recruiters and screening tools look for.',body:`
<ul><li>Title line that matches the target role ("Platform / SRE Engineer — Python, CI/CD, Linux, Storage").</li><li>Each bullet: action verb + what + measurable result ("Found 11 SQL defects incl. a release blocker…").</li><li>Mirror the job description's keywords where they're true for you.</li><li>Skills grouped: languages, CI/CD, cloud/containers, OS, storage, observability.</li><li>One page per 5 years is a good rule; PDF; consistent dates.</li><li>LinkedIn: same headline, "Open to work" (recruiters only), Hyderabad + remote, featured projects (CodeTrail, your patent application once public).</li><li>Never claim a tool you can't discuss for 10 minutes.</li></ul>`},
{id:'plan',cat:'Interview playbooks',title:'Answering "What would you do in your first 90 days?"',sum:'A simple structure that shows judgement.',body:`
<ol><li><b>Days 1–30, learn</b>: the systems, on-call and incident history, SLOs, deploy pipeline, people. Ship one small fix to learn the path to production.</li><li><b>Days 31–60, contribute</b>: own a service or area, fix top toil or a flaky test set, improve one dashboard or alert.</li><li><b>Days 61–90, improve</b>: propose and deliver one measurable improvement (deploy time, MTTR, test reliability), and document it.</li></ol><p>Close with: "and I'd check in with you at each stage to make sure I'm working on what matters most to the team."</p>`}
];

const DOCS=[
{cat:'Python',items:[['Python 3 documentation','https://docs.python.org/3/','Language reference, tutorial and the standard library.'],['Python standard library index','https://docs.python.org/3/library/index.html','collections, itertools, re, json, subprocess, pathlib, logging…'],['asyncio','https://docs.python.org/3/library/asyncio.html','Coroutines, tasks, gather, semaphores.'],['pytest documentation','https://docs.pytest.org/en/stable/','Fixtures, parametrize, hooks, plugins.'],['PEP 8 style guide','https://peps.python.org/pep-0008/','How reviewers expect Python to look.'],['Requests','https://requests.readthedocs.io/en/latest/','HTTP calls, sessions, timeouts.'],['FastAPI','https://fastapi.tiangolo.com/','Modern Python APIs with validation.']]},
{cat:'Linux & shell',items:[['Linux man pages (man7.org)','https://man7.org/linux/man-pages/','Authoritative man pages for commands and syscalls.'],['GNU Bash manual','https://www.gnu.org/software/bash/manual/bash.html','Expansions, redirection, scripting.'],['systemd documentation','https://systemd.io/','Units, services, journald.'],['Red Hat Enterprise Linux documentation','https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/','RHEL admin guides (common in enterprise roles).'],['IBM AIX documentation','https://www.ibm.com/docs/en/aix','For AIX questions from your background.']]},
{cat:'Git & CI/CD',items:[['Pro Git book','https://git-scm.com/book/en/v2','Free, official Git book.'],['GitHub Actions documentation','https://docs.github.com/en/actions','Workflows, runners, secrets, OIDC.'],['Jenkins user handbook','https://www.jenkins.io/doc/book/','Pipelines, agents, credentials.'],['GitLab CI/CD','https://docs.gitlab.com/ci/','.gitlab-ci.yml reference.'],['Argo CD','https://argo-cd.readthedocs.io/en/stable/','GitOps continuous delivery for Kubernetes.']]},
{cat:'Containers & Kubernetes',items:[['Docker documentation','https://docs.docker.com/','Dockerfile reference, build, compose.'],['Dockerfile best practices','https://docs.docker.com/build/building/best-practices/','Smaller, safer images.'],['Kubernetes documentation','https://kubernetes.io/docs/home/','Concepts, tasks, reference.'],['kubectl quick reference','https://kubernetes.io/docs/reference/kubectl/quick-reference/','Everyday kubectl commands.'],['CKA curriculum (CNCF)','https://github.com/cncf/curriculum','What the CKA exam covers.'],['Helm documentation','https://helm.sh/docs/','Charts, values, releases.'],['Kubernetes security — Pod Security Standards','https://kubernetes.io/docs/concepts/security/pod-security-standards/','Baseline and restricted profiles.']]},
{cat:'Infrastructure as code',items:[['Terraform documentation','https://developer.hashicorp.com/terraform/docs','Language, state, modules, CLI.'],['Terraform tutorials','https://developer.hashicorp.com/terraform/tutorials','Hands-on labs.'],['Ansible documentation','https://docs.ansible.com/','Playbooks, modules, roles, vault.']]},
{cat:'Cloud',items:[['AWS documentation','https://docs.aws.amazon.com/','All AWS services.'],['AWS Well-Architected Framework','https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html','Reliability, security, cost pillars — common in design rounds.'],['AWS Skill Builder (free courses)','https://skillbuilder.aws/','Free official training.'],['Microsoft Learn — Azure','https://learn.microsoft.com/en-us/azure/','For Microsoft and Azure-based roles.'],['Azure Well-Architected Framework','https://learn.microsoft.com/en-us/azure/well-architected/','Azure equivalent of the design pillars.']]},
{cat:'SRE & observability',items:[['Google SRE book (free)','https://sre.google/sre-book/table-of-contents/','SLOs, error budgets, incidents, toil.'],['Google SRE workbook','https://sre.google/workbook/table-of-contents/','Practical SLO and alerting examples.'],['Prometheus documentation','https://prometheus.io/docs/introduction/overview/','Metrics, PromQL, alerting.'],['Grafana documentation','https://grafana.com/docs/grafana/latest/','Dashboards and alerts.'],['OpenTelemetry documentation','https://opentelemetry.io/docs/','Traces, metrics, logs, collectors.'],['PagerDuty incident response guide','https://response.pagerduty.com/','Incident roles and process — widely used.']]},
{cat:'Storage & data protection',items:[['SNIA educational library','https://www.snia.org/educational-library','Vendor-neutral storage education.'],['NIST SP 800-209: storage security','https://csrc.nist.gov/pubs/sp/800/209/final','Security guidelines for storage infrastructure.'],['NIST SP 800-34: contingency planning','https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final','BIA, recovery strategies, testing — backs your BCP work.'],['IBM Storage Protect documentation','https://www.ibm.com/docs/en/storage-protect','Your product: architecture, admin, Operations Center.'],['AWS S3 Object Lock','https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html','Immutable backups in the cloud.']]},
{cat:'Security',items:[['CompTIA Security+ (SY0-701) exam objectives','https://www.comptia.org/certifications/security','The five domains and objectives.'],['OWASP Top 10','https://owasp.org/Top10/','Web application risks.'],['NIST Cybersecurity Framework 2.0','https://www.nist.gov/cyberframework','Govern, identify, protect, detect, respond, recover.'],['NIST SP 800-61r3: incident response','https://csrc.nist.gov/pubs/sp/800/61/r3/final','Incident handling guidance.'],['CIS Benchmarks','https://www.cisecurity.org/cis-benchmarks','Hardening baselines for OS, cloud, Kubernetes.']]},
{cat:'Networking',items:[['MDN — HTTP','https://developer.mozilla.org/en-US/docs/Web/HTTP','Methods, status codes, headers, caching.'],['RFC 9110: HTTP semantics','https://www.rfc-editor.org/rfc/rfc9110','The HTTP standard.'],['RFC 9293: TCP','https://www.rfc-editor.org/rfc/rfc9293','The TCP standard (windowing, handshake).'],['RFC 8446: TLS 1.3','https://www.rfc-editor.org/rfc/rfc8446','How TLS 1.3 works.'],['Cloudflare Learning Center','https://www.cloudflare.com/learning/','Clear explainers: DNS, TLS, CDN, DDoS.']]},
{cat:'Databases & SQL',items:[['PostgreSQL documentation','https://www.postgresql.org/docs/current/','SQL, indexes, replication, backups.'],['SQLite SQL reference','https://www.sqlite.org/lang.html','The SQL used by drills in this app.'],['Redis documentation','https://redis.io/docs/latest/','Caching, rate limiting, data types.']]},
{cat:'System design & architecture',items:[['AWS Builders’ Library','https://aws.amazon.com/builders-library/','How Amazon builds reliable systems (timeouts, retries, backoff).'],['Microsoft Azure Architecture Center','https://learn.microsoft.com/en-us/azure/architecture/','Reference architectures and patterns.'],['Google Cloud Architecture Center','https://cloud.google.com/architecture','Patterns and reference designs.'],['The Twelve-Factor App','https://12factor.net/','Principles for cloud-ready services.']]},
{cat:'Practice platforms',items:[['LeetCode','https://leetcode.com/problemset/','Coding questions by topic and company.'],['SadServers','https://sadservers.com/','Broken Linux servers to fix — SRE practice.'],['Killercoda','https://killercoda.com/','Free Kubernetes and Linux labs in the browser.'],['KodeKloud free labs','https://kodekloud.com/','CKA, Terraform, Ansible labs.'],['Exercism Python','https://exercism.org/tracks/python','Mentored Python exercises.']]},
{cat:'Hiring process (official pages)',items:[['Microsoft Careers','https://careers.microsoft.com/','Roles, teams and hiring tips.'],['Google — how we hire','https://www.google.com/about/careers/applications/how-we-hire/','Structured interviews and what they assess.'],['Amazon — Leadership Principles','https://www.amazon.jobs/content/en/our-workplace/leadership-principles','Many behavioural loops use these themes.'],['HSBC careers — hiring process','https://www.hsbc.com/careers','Roles, process and FAQs.'],['Amgen careers','https://careers.amgen.com/','Open roles and culture.']]},
{cat:'Career & workplace (India)',items:[['EPFO — member services','https://www.epfindia.gov.in/','Provident Fund: check transfers when you switch jobs.'],['Income Tax Department e-filing','https://www.incometax.gov.in/','Form 16 and tax regime choice when changing jobs mid-year.'],['LinkedIn Help Center','https://www.linkedin.com/help/linkedin','Profile, Open to Work and job alerts.']]}
];

/* What a ~4-year engineer is expected to know for each target role, in 90-day order.
   lv: must = asked in almost every loop; strong = often asked, a differentiator; plus = nice to have. */
const SYL={
sre:{lvl:'Mid-level (3–6 years): expected to own services, lead incidents and automate toil — not just follow runbooks.',items:[
['Linux internals & troubleshooting','must','Processes, signals, memory, disk and I/O tools; diagnose a slow or full server live.',['o1','o16','o10','o20'],'1–2'],
['Networking','must','DNS resolution, TCP handshake and windowing, TLS chain, HTTP codes, load balancers, what happens on a request.',['o2','k6','o17'],'1–2'],
['Python & Bash for automation','must','Write a log parser, an API client with retries, a CLI — without AI, in 30 minutes.',['p1','p5','a6','a8','o11'],'1–3 (drills daily)'],
['Kubernetes operations (CKA level)','must','Workloads, services, probes, RBAC, NetworkPolicy, scheduling, etcd backup, upgrades, debugging.',['o5','k5','o12','o13','o14','o21'],'4–6'],
['Observability','must','Golden signals, PromQL with rate(), SLO-based alerting, traces with OpenTelemetry.',['o7','o9'],'7'],
['SLIs, SLOs, error budgets, incidents','must','Define SLOs for a service, run an incident, write a blameless postmortem.',['o7','k17','r1','r2','r3'],'7–8'],
['CI/CD & GitOps','strong','Pipelines, artefact promotion, canary/blue-green, Argo CD.',['o6','o8','o19','k13'],'5'],
['Terraform & cloud','strong','Remote state, modules, drift; AWS IAM, VPC, EKS; Azure basics for Microsoft roles.',['o15','k10','w1','w2','w4','w5','o23'],'5–6'],
['System design for reliability','strong','Design for failure: redundancy, retries with backoff, idempotency, rate limits, DR.',['k7','k8','k14','k15','k11','k12'],'9–10'],
['Storage & DR (your edge)','plus','RPO/RTO, backups vs snapshots, ransomware-resistant copies — few SRE candidates have this.',['s4','s5','s8','w3'],'3']]},
devops:{lvl:'Mid-level: expected to build and maintain pipelines and infrastructure end to end, and improve developer flow.',items:[
['CI/CD pipelines','must','Jenkins and GitHub Actions: stages, caching, matrices, secrets, build-once-promote.',['o6','o19','k13'],'5'],
['Docker','must','Multi-stage builds, layers, non-root, debugging containers, exit codes.',['o4','k4'],'4'],
['Kubernetes','must','Deployments, Services, Ingress, ConfigMaps/Secrets, probes, Helm, troubleshooting.',['o5','k5','o13','o21','o22'],'4–6'],
['Infrastructure as code','must','Terraform state, modules, for_each, drift; Ansible playbooks and idempotence.',['o15','k10','o18'],'5–6'],
['Cloud (AWS and/or Azure)','must','IAM, networking, compute, storage, managed Kubernetes; least privilege.',['w1','w2','w3','w4','w5','o23'],'6'],
['Linux, Git & scripting','must','Daily Linux, Git branching/revert/bisect, Bash and Python scripts.',['o1','o3','o10','o11','a6'],'1–2'],
['Monitoring & incidents','strong','Prometheus/Grafana, alerting on symptoms, postmortems.',['o7','o9','k17'],'7'],
['Security in the pipeline','strong','Secrets management, image scanning, OIDC instead of static keys.',['x5','a8','o17'],'8'],
['Release strategies','strong','Canary, blue-green, feature flags, rollback.',['o6','o8'],'5']]},
sdet:{lvl:'Senior SDET / automation (4+ years): expected to design frameworks, own test strategy and keep CI reliable.',items:[
['Python coding','must','Strings, dicts, lists, OOP, exceptions — two live problems in an hour.',['p1','p2','p3','p4','p5'],'1–3 (drills daily)'],
['pytest framework design','must','Fixtures and scopes, conftest, parametrize, hooks, markers, parallel runs, reporting.',['a1','a2','a5'],'2'],
['API testing','must','requests with timeouts, status codes, schema checks, auth, contract tests.',['a3','a8'],'2'],
['UI automation','strong','Playwright/Selenium waits, locators, Page Object Model, flaky-test control.',['a4','a5'],'3'],
['Test design & strategy','must','Boundary values, equivalence classes, pyramid, risk-based testing, shift left.',['k9','a9'],'3'],
['CI integration','must','Run suites in Jenkins/GitHub Actions, quarantine flaky tests, publish reports.',['o19','o6'],'5'],
['SQL & data validation','strong','Joins, grouping, duplicates, source-to-target checks.',['a7'],'3 (SQL drills)'],
['System & resiliency testing (your edge)','plus','Workloads, failure injection, soak tests — your SVT experience.',['a9','k7'],'8']]},
res:{lvl:'Resilience / data protection engineer: expected to design, test and prove recovery, not just run backups.',items:[
['Backup & recovery fundamentals','must','Full/incremental/differential, dedup, catalog, retention, restore testing.',['s4','s6','k14'],'3'],
['RPO, RTO, BIA and DR plans','must','Set targets with the business, design to them, prove them with drills.',['s5','x7'],'3'],
['Storage foundations','must','Block/file/object, RAID, replication, erasure coding, NVMe, performance maths.',['s1','s2','s3','s7'],'3'],
['Ransomware resilience','must','Immutable copies, air gaps, separate credentials, clean-room recovery.',['s8','w3','x7'],'8'],
['Cloud backup & DR','strong','S3 Object Lock, cross-region/account copies, AZ and region failure design.',['w3','w5'],'6'],
['Kubernetes data protection','strong','PVs/PVCs, StorageClasses, etcd backup, application-consistent backups.',['s9','o14'],'6'],
['Automation of recovery tests','strong','Scripted restore tests that measure actual RTO, in CI or on a schedule.',['a6','a9'],'2–3'],
['Incident response & BCP','strong','NIST 800-61/800-34 flow, communication, lessons learned.',['x7','k17','r1'],'8']]},
pyauto:{lvl:'Python automation engineer: expected to write maintainable tools and integrations that others rely on.',items:[
['Core Python','must','Data structures, comprehensions, generators, decorators, OOP, exceptions.',['p1','p2','p3','p4','p5'],'1–2'],
['Files, subprocess, CLI','must','pathlib, subprocess without shell=True, argparse, logging.',['a6'],'2'],
['APIs & data','must','requests with retries and backoff, JSON, pagination, rate limits.',['a8','a3','k15'],'2'],
['Concurrency','strong','Threads vs processes vs asyncio; semaphores; the GIL.',['p6','k3','p8'],'3'],
['Testing your tools','must','pytest, mocking, fixtures.',['a1','a2'],'2'],
['Packaging & CI','strong','Virtual envs, requirements, pipelines that test and publish.',['o19','o6'],'5'],
['Linux & scripting','strong','Bash one-liners and when to switch to Python.',['o10','o11','o16'],'1']]}};

/* ---------- More guides ---------- */
GUIDES.push(
{id:'playbooks',cat:'Troubleshooting playbooks',title:'Production scenarios: step-by-step answers',sum:'The scenario questions SRE and DevOps loops love, with a calm order of steps.',body:`
<h3>"The website is down"</h3><ol><li>Confirm and scope: is it everyone or some users, one region, one endpoint? Check the status page, synthetic checks, error-rate dashboards.</li><li>What changed? Recent deploys, config, certificates, DNS, infrastructure.</li><li>Mitigate: roll back, fail over, scale out, or switch off the feature.</li><li>Follow the request path: DNS → load balancer → app → dependencies (DB, cache, third parties). Look for the first failing hop.</li><li>Communicate on a schedule; postmortem afterwards.</li></ol>
<h3>"Latency doubled since this morning"</h3><ol><li>Which percentile (p50 vs p99) and which endpoints?</li><li>Saturation: CPU, memory, connection pools, thread pools, queue depth.</li><li>Dependencies: slow DB queries (check slow-query log), cache hit rate dropped, a downstream timeout.</li><li>Traffic shape: a new client, a retry storm, a bot.</li><li>Fix the bottleneck, then add an alert on the symptom.</li></ol>
<h3>"Database connections exhausted"</h3><ol><li>Who holds connections (pg_stat_activity / SHOW PROCESSLIST)? Long-running or idle-in-transaction sessions?</li><li>Did app instances scale out and multiply pool sizes?</li><li>Mitigate: kill stuck sessions, lower pool size per instance, add a pooler (PgBouncer).</li><li>Prevent: timeouts on queries and idle transactions, alerts at 80% of max connections.</li></ol>
<h3>"A pod keeps getting OOMKilled"</h3><ol><li>kubectl describe → Last State: OOMKilled, exit code 137.</li><li>Compare real usage (kubectl top, metrics history) with the memory limit.</li><li>Leak or legitimate growth? Check the trend after restarts and heap profiles.</li><li>Right-size requests/limits, fix the leak, add a memory alert below the limit.</li></ol>
<h3>"Deploy succeeded but users see errors"</h3><ol><li>Compare error rate before and after the rollout timestamp.</li><li>Roll back first if impact is real.</li><li>Then diff config, dependencies, feature flags and database migrations between versions.</li><li>Prevent: canary with automatic rollback on SLO breach.</li></ol>
<h3>"Server unreachable over SSH"</h3><ol><li>Network: ping, route, security group / firewall, is port 22 open (nc -zv)?</li><li>Host: cloud console or serial console — is it out of disk, memory, or hung?</li><li>Auth: keys, user, sshd config, account locked.</li><li>Recover via console, fix, then automate the check.</li></ol>`},
{id:'promql',cat:'Technical cheat sheets',title:'PromQL & alerting',sum:'The queries and alert rules interviewers ask you to write.',body:`
<pre># request rate per service (counter → per-second)
sum by (service) (rate(http_requests_total[5m]))

# error ratio
sum(rate(http_requests_total{code=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m]))

# 95th percentile latency from a histogram
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# disk will be full within 4 hours
predict_linear(node_filesystem_avail_bytes[6h], 4*3600) < 0

# CPU busy %
100 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100</pre>
<pre># alert rule
- alert: HighErrorRate
  expr: sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.02
  for: 10m
  labels: { severity: page }
  annotations: { summary: "5xx above 2% for 10 minutes", runbook: "https://wiki/runbooks/high-errors" }</pre>
<ul><li>Counters only go up — always wrap them in rate() or increase().</li><li>Keep label cardinality low (no user IDs in labels).</li><li>Page on symptoms users feel; ticket on causes.</li></ul>`},
{id:'aws',cat:'Technical cheat sheets',title:'AWS core services in one page',sum:'What each service is for, and the classic interview angles.',body:`
<table><tr><th>Need</th><th>Service</th><th>Interview angle</th></tr>
<tr><td>Identity</td><td>IAM (users, roles, policies)</td><td>Roles over keys; explicit deny wins; least privilege</td></tr>
<tr><td>Network</td><td>VPC, subnets, route tables, IGW, NAT, SG, NACL</td><td>Public vs private subnets; SG stateful, NACL stateless</td></tr>
<tr><td>Compute</td><td>EC2, Auto Scaling, Lambda</td><td>Launch templates, health checks, cold starts</td></tr>
<tr><td>Containers</td><td>ECR, ECS, EKS</td><td>Pod identity / IRSA, managed node groups</td></tr>
<tr><td>Storage</td><td>S3, EBS, EFS</td><td>S3 classes, versioning, Object Lock; EBS is per-AZ</td></tr>
<tr><td>Databases</td><td>RDS, Aurora, DynamoDB</td><td>Multi-AZ vs read replicas; backups and PITR</td></tr>
<tr><td>Traffic</td><td>ELB (ALB/NLB), Route 53, CloudFront</td><td>L7 vs L4; health checks; DNS failover</td></tr>
<tr><td>Observability</td><td>CloudWatch, CloudTrail, X-Ray</td><td>Metrics/logs vs who-did-what audit</td></tr>
<tr><td>Secrets</td><td>Secrets Manager, KMS, SSM Parameter Store</td><td>Rotation; envelope encryption</td></tr>
<tr><td>IaC & CI</td><td>CloudFormation, CodePipeline, CodeBuild</td><td>vs Terraform and GitHub Actions</td></tr></table>`},
{id:'cicd',cat:'Technical cheat sheets',title:'CI/CD pipeline design reference',sum:'A pipeline you can draw and defend in any interview.',body:`
<pre>commit → lint + unit tests → build artefact/image (once, tagged by commit SHA)
       → security scans (SAST, dependencies, image) → integration tests
       → publish to registry → deploy to staging (GitOps / pipeline)
       → smoke + e2e tests → approval (if required)
       → canary 5% → watch SLOs → 50% → 100%  (auto-rollback on breach)</pre>
<ul><li><b>Build once, promote the same artefact</b> — never rebuild per environment.</li><li><b>Fast feedback</b>: cache dependencies, parallelise tests, fail fast on lint/unit.</li><li><b>Secrets</b>: from a vault or OIDC federation, never in the repo or logs.</li><li><b>Flaky tests</b>: quarantine with a ticket; track flakiness rate.</li><li><b>Database migrations</b>: backward-compatible (expand → migrate → contract) so rollback works.</li><li><b>Measure</b> (DORA): deployment frequency, lead time, change failure rate, time to restore.</li></ul>`},
{id:'pytest',cat:'Technical cheat sheets',title:'pytest essentials',sum:'Fixtures, parametrize, mocking and hooks on one page.',body:`
<pre>import pytest
from unittest.mock import patch

@pytest.fixture(scope="session")
def api():
    client = make_client()
    yield client            # teardown runs after the yield
    client.close()

@pytest.mark.parametrize("size,expected", [(0, "0 B"), (1536, "1.5 KiB")])
def test_human(size, expected):
    assert human(size) == expected

def test_timeout_is_retried(api):
    with patch("app.client.requests.get", side_effect=[TimeoutError, ok_response()]) as g:
        assert api.fetch("/x").status == 200
    assert g.call_count == 2

def test_raises():
    with pytest.raises(ValueError, match="bad"):
        parse("bad")</pre>
<pre>pytest -k login -m "not slow" -x -vv       # select, stop at first failure
pytest -n auto                              # parallel (pytest-xdist)
pytest --junitxml=reports/junit.xml         # CI report
# conftest.py hooks: pytest_addoption, pytest_collection_modifyitems, pytest_runtest_makereport</pre>`},
{id:'bash',cat:'Technical cheat sheets',title:'Bash script template',sum:'Safe defaults and patterns for scripts you hand to others.',body:`
<pre>#!/usr/bin/env bash
set -euo pipefail                 # stop on errors, unset vars, failed pipes
IFS=$'\\n\\t'
trap 'echo "failed at line $LINENO" >&2' ERR
trap 'rm -rf "$TMP"' EXIT
TMP=$(mktemp -d)

usage() { echo "usage: $0 -e env [-n]" >&2; exit 2; }
DRY=0
while getopts "e:n" opt; do
  case $opt in e) ENV=$OPTARG ;; n) DRY=1 ;; *) usage ;; esac
done
: "$ENV"                          # fails if ENV is unset (set -u)

log() { printf '%s %s\\n' "$(date -Is)" "$*"; }
run() { if [ "$DRY" = 1 ]; then log "DRY: $*"; else "$@"; fi; }

for host in $(cat "hosts.$ENV"); do
  log "restarting on $host"
  run ssh -o ConnectTimeout=5 "$host" sudo systemctl restart app
done</pre>
<ul><li>Quote variables: "$var".</li><li>Use $(...) not backticks; [[ ]] for tests.</li><li>Exit codes: 0 success, non-zero failure; check them.</li><li>Past ~50 lines or with data structures, switch to Python.</li></ul>`},
{id:'sec',cat:'Technical cheat sheets',title:'Security essentials for DevOps/SRE',sum:'What security-minded interviewers expect you to say.',body:`
<ul><li><b>Identity</b>: least privilege, roles not long-lived keys, MFA for humans, short-lived tokens (OIDC) for machines.</li><li><b>Secrets</b>: vault/secrets manager, rotation, never in Git, images or logs; scan repos for leaks.</li><li><b>Transport</b>: TLS everywhere, mTLS between services where trust matters, certificate expiry monitoring.</li><li><b>Supply chain</b>: pin dependencies, scan images and packages, sign artefacts, minimal base images.</li><li><b>Kubernetes</b>: RBAC, NetworkPolicies (default deny), Pod Security restricted, non-root, read-only root FS.</li><li><b>Data</b>: encryption at rest, backups with an immutable copy, tested restores.</li><li><b>Detect & respond</b>: audit logs (CloudTrail), alerting on risky changes, an incident process (NIST 800-61).</li><li><b>Web</b>: OWASP Top 10 — broken access control, injection (parameterised queries), misconfiguration.</li></ul>`},
{id:'patterns',cat:'Interview playbooks',title:'Coding patterns: which tool for which problem',sum:'Recognise the pattern, then practise it with the drills in this app.',body:`
<table><tr><th>If the problem says…</th><th>Reach for</th><th>Drills here</th></tr>
<tr><td>count, frequency, duplicates, "seen before"</td><td>dict / Counter / set</td><td>Top k frequent, Dedupe, Anagram check</td></tr>
<tr><td>contiguous window, "last N", rate</td><td>sliding window (two indices)</td><td>Busiest k minutes, Longest unique run, Busiest minute</td></tr>
<tr><td>sorted input, pair/target</td><td>two pointers or binary search</td><td>Binary search, Two sum</td></tr>
<tr><td>top/bottom k, merge streams</td><td>heap (heapq)</td><td>k slowest requests</td></tr>
<tr><td>dependencies, order, "before"</td><td>topological sort (Kahn)</td><td>Deployment order</td></tr>
<tr><td>shortest path, levels, hops</td><td>BFS with a queue</td><td>Fewest network hops</td></tr>
<tr><td>nested structure</td><td>recursion or a stack</td><td>Flatten, Balanced brackets</td></tr>
<tr><td>intervals, schedules</td><td>sort by start, then merge</td><td>Merge intervals</td></tr>
<tr><td>recent-use eviction</td><td>OrderedDict</td><td>LRU cache</td></tr>
<tr><td>parse text/logs</td><td>split, re, Counter</td><td>Top client IPs, Top error codes, Parse key=value, Mask secrets</td></tr></table>
<p>Practise in Code → Drills with Interview mode on: no hints, timed.</p>`},
{id:'stories',cat:'Interview playbooks',title:'Behavioural question → which story to use',sum:'One prepared story answers many questions.',body:`
<table><tr><th>Question theme</th><th>Use your story</th></tr>
<tr><td>Biggest achievement / proud of</td><td>A critical defect you caught</td></tr>
<tr><td>Mistake / failure</td><td>A mistake you made</td></tr>
<tr><td>Conflict / disagreement / influence</td><td>Product or setup? · Raised a risk early</td></tr>
<tr><td>Ambiguity / changing requirements</td><td>A critical defect you caught (scope kept moving)</td></tr>
<tr><td>Process improvement / automation</td><td>A process you automated · Your validation and automation work</td></tr>
<tr><td>Customer focus</td><td>A customer-facing issue</td></tr>
<tr><td>Learning fast / new team</td><td>Moved to a new team</td></tr>
<tr><td>Going beyond your role / leadership</td><td>The BCP plan · Your patent application</td></tr>
<tr><td>Why leave / why this role</td><td>Why this company, and why leave now?</td></tr></table>
<p>Your drafts are in Prep → Stories; rehearse each with the 2-minute timer.</p>`},
{id:'research',cat:'Interview playbooks',title:'Company research in 20 minutes',sum:'What to know before any interview, and where to find it.',body:`
<ol><li><b>What they sell and to whom</b> — company site, latest annual report or investor page.</li><li><b>What the team does</b> — the job description, team blog, engineering talks.</li><li><b>Their stack</b> — job description keywords, engineering blog, GitHub.</li><li><b>Recent news</b> — last 3 months: launches, acquisitions, results.</li><li><b>Interview format</b> — the Companies tab here and candidate reports.</li><li><b>Your fit</b> — 3 requirements you match with proof, 1 gap and how you're closing it.</li><li><b>Your questions</b> — about the team's biggest challenge, on-call, how success is measured in 90 days.</li></ol>`},
{id:'switch',cat:'Job switch (India)',title:'Resignation, notice and joining checklist',sum:'The non-technical steps that trip people up when switching jobs.',body:`
<ol><li><b>Get the offer in writing</b> before resigning: role, level, CTC breakdown, joining date, location, notice/probation terms.</li><li><b>Resign in writing</b> (email to your manager, as your HR policy requires) and keep a copy. Stay professional.</li><li><b>Notice period</b>: ask about early release or buy-out; get any agreement in writing.</li><li><b>Knowledge transfer</b>: handover documents, scripts, open issues and contacts — protects your reputation and reference.</li><li><b>Documents to collect</b>: relieving letter, experience letter, last payslips, Form 16 (and Form 12B details for the new employer if you join mid-year).</li><li><b>Provident Fund</b>: keep the same UAN; check the transfer on the EPFO member portal after joining.</li><li><b>Background verification</b>: expect checks on employment dates, education and sometimes address; dates on your resume must match records.</li><li><b>Company assets and access</b>: return laptops and badges; don't copy company code or documents.</li></ol>`},
{id:'gloss',cat:'Technical cheat sheets',title:'Glossary: 40 terms in one line each',sum:'Quick recall before a round.',body:`
<ul><li><b>Idempotent</b>: doing it twice = doing it once.</li><li><b>Backoff with jitter</b>: retry after growing, randomised waits.</li><li><b>Circuit breaker</b>: stop calling a failing dependency for a while.</li><li><b>Bulkhead</b>: isolate resources so one failure doesn't sink all.</li><li><b>Toil</b>: manual, repetitive, automatable ops work.</li><li><b>SLI/SLO/SLA</b>: measure / target / contract.</li><li><b>Error budget</b>: allowed unreliability (1 − SLO).</li><li><b>MTTR</b>: mean time to restore.</li><li><b>Canary</b>: release to a small share first.</li><li><b>Blue-green</b>: switch traffic between two full environments.</li><li><b>Feature flag</b>: turn code paths on/off without deploying.</li><li><b>GitOps</b>: Git is the source of truth; an agent syncs the cluster.</li><li><b>Drift</b>: real infrastructure differs from code.</li><li><b>Immutable infrastructure</b>: replace, don't patch in place.</li><li><b>Sidecar</b>: helper container next to the app (proxy, log shipper).</li><li><b>Service mesh</b>: sidecars handling mTLS, retries, routing.</li><li><b>Ingress</b>: HTTP routing into a cluster.</li><li><b>Taint/toleration</b>: keep pods off nodes unless they tolerate it.</li><li><b>Affinity</b>: prefer/require pods on certain nodes or near others.</li><li><b>PDB</b>: limit how many pods can be down during maintenance.</li><li><b>HPA</b>: scale pod count on metrics.</li><li><b>etcd</b>: Kubernetes' state store.</li><li><b>CNI</b>: plugin that wires pod networking.</li><li><b>Cgroups / namespaces</b>: limit / isolate container resources and views.</li><li><b>OOM killer</b>: kernel kills a process when memory runs out.</li><li><b>Inode</b>: file metadata entry; can run out before space.</li><li><b>Load average</b>: runnable + waiting tasks over 1/5/15 min.</li><li><b>RPO / RTO</b>: data loss allowed / restore time allowed.</li><li><b>Dedup</b>: store identical chunks once.</li><li><b>Erasure coding</b>: data + parity across nodes, cheaper than copies.</li><li><b>Snapshot</b>: point-in-time view on the same system.</li><li><b>Immutable backup</b>: can't be changed or deleted until retention ends.</li><li><b>WAL / PITR</b>: write-ahead log / restore to any moment.</li><li><b>CAP</b>: under partition, choose consistency or availability.</li><li><b>Sharding</b>: split data across databases by key.</li><li><b>Read replica</b>: copy for scaling reads.</li><li><b>mTLS</b>: both sides present certificates.</li><li><b>OIDC federation</b>: short-lived cloud credentials for pipelines.</li><li><b>SBOM</b>: list of components in your software.</li><li><b>DORA metrics</b>: deploy frequency, lead time, change failure rate, time to restore.</li></ul>`}
);
DOCS.push(
{cat:'More official references',items:[['DORA — State of DevOps research','https://dora.dev/','The four key delivery metrics and research behind them.'],['Kubernetes — Horizontal Pod Autoscaling','https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/','Including custom and external metrics.'],['KEDA — event-driven autoscaling','https://keda.sh/docs/','Scale on queues, Kafka lag, cron.'],['Prometheus — alerting rules','https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/','Writing alerts with for: and labels.'],['AWS IAM — policy evaluation logic','https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html','Implicit vs explicit deny.'],['OWASP Cheat Sheet Series','https://cheatsheetseries.owasp.org/','Practical secure-coding guidance.'],['SLSA — supply-chain security levels','https://slsa.dev/','Build integrity and provenance.'],['NetApp documentation','https://docs.netapp.com/','For storage-company interviews.'],['Commvault documentation','https://documentation.commvault.com/','Backup concepts as another vendor implements them.']]});
FEED.push({d:`2026-11-21`,items:[`23 more reported interview questions — Commvault, NetApp, Cohesity, JPMorganChase, Deloitte, DTCC — each linked to its source; 4 new company guides.`,`12 more guides: production troubleshooting playbooks, PromQL & alerting, AWS core services, CI/CD design, pytest, Bash template, security essentials, coding patterns, behavioural-story map, company research, job-switch checklist, glossary.`]});
