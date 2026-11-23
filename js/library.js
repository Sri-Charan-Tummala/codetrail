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

/* ---------- Resilience & release engineering (Nov 2026) ---------- */
DECK.rel=`Release & build`;
{const add=(tr,arr)=>{const n=CARDS.filter(c=>c.tr===tr).length;arr.forEach(([q,a],i)=>CARDS.push({k:tr+(n+i),tr,q,a}))};
add('sto',[
[`How is recovering from ransomware different from a normal restore?`,`A normal restore assumes the backup is good and the environment is safe. After ransomware neither is true. Contain first and keep the backup system isolated. Find the earliest sign of compromise and pick a restore point before it. Restore into an isolated clean room, scan, and rotate credentials. Then restore in dependency order: identity and DNS, core infrastructure, then apps by business priority.`],
[`What's an immutable backup, and why isn't read-only enough?`,`Immutable means a retention lock (WORM, object lock) that nobody, admins included, can shorten or remove before it expires. A read-only flag can be cleared by any admin, and attackers usually have admin rights by the time they reach backups.`],
[`What is a cyber vault or isolated recovery environment?`,`A copy of critical backups on infrastructure that's logically or physically separate: its own network path that opens only to replicate, separate admin accounts with MFA, and immutable storage. It also has a clean environment where you can restore, scan and test data before it goes back to production.`],
[`Full vs incremental vs differential vs synthetic full?`,`Full copies everything. Incremental copies changes since the last backup of any kind, so it's fast but a restore needs the whole chain. Differential copies changes since the last full, so a restore needs the full plus the latest differential. A synthetic full is built on the server from the last full and later incrementals, without touching the client.`],
[`Incremental-forever: benefits and risks?`,`Benefits: after one full, only changed data moves, so backup windows and network load stay small. Risks: everything depends on the catalog and on the integrity of older data, so you must protect the server database, run integrity audits, and test restores of old versions as well as recent ones.`],
[`Why protect the backup server's catalog or database?`,`It records every version and where it's stored. Lose it and the data is still on disk but you can't find it quickly, so restores slow to a crawl. Back up the database and its logs, keep a copy offsite, and include a server rebuild in the DR plan.`],
[`How do you test a DR plan?`,`Start from the RPO and RTO agreed with the business. Run tabletop exercises for people and decisions. Run regular timed restores of real data into an isolated environment, with checksum and application-level checks. Then do failover tests or game days for critical services. Record measured times against the targets, fix the gaps, and update the runbook.`],
[`During a real incident the restore fails. What do you do?`,`Stay calm and communicate. Check whether it's the data (a corrupt or missing version: try the previous version or another copy) or the path (network, permissions, target space, server load: fix it and retry). Escalate to the vendor early. Keep stakeholders updated on the realistic recovery time. Afterwards, add that failure mode to regular restore testing.`],
[`How would you size backup storage?`,`Start with front-end capacity (data protected) and daily change rate. Multiply by retention (versions and days), divide by the expected dedup and compression ratio, then add growth and headroom (20–30%). Check the answer against real dedup ratios from a pilot, because databases and encrypted data deduplicate poorly.`],
[`The nightly backup window keeps growing. How do you fix it?`,`Measure each stage: client read, network, server ingest and storage write. Check whether the data volume or file count grew, and whether jobs overlap with other jobs or with storage maintenance. Then fix the bottleneck: incremental-forever or synthetic fulls, more parallel sessions, client-side dedup, splitting huge file systems, or snapshot-based backups. Alert on job duration, not just job failure.`],
[`How can backup data help detect ransomware?`,`Encrypted data looks random, so the dedup and compression ratios suddenly drop. The amount of changed data jumps. Many files change extension or get deleted. A good backup platform alerts on these signals, and the same signals help pick the last clean restore point.`],
[`What would you put on a backup and DR dashboard?`,`Backup success rate. RPO compliance (age of the last good backup per system, not just "job succeeded"). Restore-test pass rate and measured restore time against RTO. Capacity and growth. Dedup ratio trends. Anomaly alerts. Show red when a system has no restorable copy inside its RPO.`]]);
add('rel',[
[`What does a release or build engineer do?`,`Makes shipping software repeatable and safe: owns the build and CI/CD pipelines, versioning, artefact repositories, branching and release processes, rollout strategies and rollback, and build speed and reliability. The goal is that any engineer can release with confidence, many times a day if needed.`],
[`Why build once and promote the same artefact?`,`So what reaches production is exactly what passed testing. Rebuilding per environment lets unpinned dependencies, base images or build tools drift. Store the artefact with an immutable version, deploy containers by digest, and change only configuration between environments.`],
[`Explain semantic versioning.`,`MAJOR.MINOR.PATCH: an incompatible API change bumps MAJOR, a backward-compatible feature bumps MINOR, a backward-compatible fix bumps PATCH. Pre-releases like 2.0.0-rc.1 rank below 2.0.0, and build metadata after + is ignored for ordering. It tells consumers whether an upgrade is safe.`],
[`Trunk-based development vs GitFlow?`,`Trunk-based: short-lived branches merged to main at least daily, with flags hiding unfinished work. Smaller merges, faster feedback, and it suits continuous delivery. GitFlow: long-lived develop and release branches. More ceremony and painful merges, but sometimes used for products that ship versions to customers. Most teams that release often choose trunk-based.`],
[`Production runs 2.3 but main has moved to 2.5. How do you ship a hotfix?`,`Fix on main with a test, then cherry-pick the commit to the 2.3 release branch (or fix on the branch and merge forward, so the fix isn't lost). Run the same pipeline, tag 2.3.1, promote it through staging, and roll out with the normal safety checks. Make sure 2.5 has the fix too.`],
[`Rolling vs blue-green vs canary?`,`Rolling replaces instances a few at a time: cheap, but slower to undo. Blue-green runs a full new stack and switches traffic, so rollback is instant but costs double capacity during the release. Canary sends a small share of traffic to the new version, compares metrics, then widens. It's the best way to limit how many users a bad release hits.`],
[`Rollback or roll forward?`,`Roll back by default when users are hurting and the cause isn't certain: it's the fastest known-good state. Roll forward when the fix is small, understood and faster than reverting, or when a rollback is impossible, for example after a one-way data migration.`],
[`How do you make a database change safe to roll back?`,`Expand and contract. First add the new column or table and make the code write to both. Backfill. Switch reads to the new one. Only in a later release drop the old one. At every step both the current and previous app versions work against the schema, so you can always roll back one release.`],
[`Feature flags: benefits and risks?`,`Benefits: deploy dark, release to a percentage of users, kill-switch a feature without redeploying, and keep trunk releasable. Risks: flag debt, untested on/off combinations and config errors. Give every flag an owner and an expiry date, test both paths, and remove flags once the feature is fully released.`],
[`The pipeline takes 45 minutes. How do you speed it up?`,`Measure each stage first. Then: cache dependencies and Docker layers; run independent jobs in parallel; split tests across runners; build and test only what changed in a monorepo; use smaller base images; fix or quarantine flaky tests; and move slow end-to-end suites to run after merge with fast smoke tests before. Track the time as a metric.`],
[`What are SBOM, artefact signing and SLSA provenance?`,`An SBOM lists every component in an artefact (SPDX or CycloneDX), so you can tell in minutes whether a CVE affects you. Signing, for example with Sigstore cosign, proves who published the artefact and that it hasn't changed. Provenance, as defined by SLSA, is a signed record of the source, builder and steps. Deploy-time policy can refuse anything unsigned or without provenance.`],
[`How do you make builds reproducible?`,`Pin everything: lockfiles with hashes, base images by digest, and fixed tool versions. Build in clean, ephemeral containers rather than long-lived agents. Avoid network fetches during the build where you can. Strip timestamps and other non-deterministic output. The same commit should then produce the same artefact.`],
[`A release just caused errors in production. Walk me through it.`,`Declare the incident and mitigate first: halt the rollout, roll back or switch off the flag. Confirm recovery with metrics. Communicate status. Then find the cause from the diff, logs and traces. Afterwards, write a blameless postmortem and add a pipeline guard so it can't recur: a test, a canary metric or a migration check.`],
[`What release metrics would you track?`,`The DORA metrics: deployment frequency, lead time for changes, change failure rate, and the time to recover from a failed deployment. Add pipeline duration and flaky-test rate. Use them to find bottlenecks, not to rank people.`]]);}
SIMS.push(
{id:'ransom',title:`Ransomware on the file servers`,brief:`02:10: users on night shift report files renamed *.locked on the finance share. Endpoint protection flags mass encryption on fs01 and fs02.`,steps:[
 {q:`What's your first move?`,opts:[
  {cmd:`Isolate fs01 and fs02 from the network (EDR network quarantine); keep them powered on`,out:`fs01, fs02: network contained. Encryption activity stops spreading to other shares.`,ok:true,why:`Contain first. Leaving them powered on keeps memory and disk evidence for forensics.`},
  {cmd:`Restore the finance share from last night's backup right away`,out:`Restore started… new files are encrypted again within minutes.`,ok:false,why:`The attacker is still active, so you're restoring into a burning building.`},
  {cmd:`Shut down and reimage fs01`,out:`fs01 reimaged. Forensic evidence lost; the infection on fs02 continues.`,ok:false,why:`You destroyed evidence and didn't stop the spread.`}]},
 {q:`Are the backups safe? Check the backup server.`,opts:[
  {cmd:`Review the backup server's activity log for admin logins and delete or expire commands`,out:`01:58 admin bkp_svc logged in from 10.4.7.22 (not a normal admin host)
02:01 DELETE on storage pool FIN_IMMUTABLE — DENIED: retention lock until 2027-02-14
02:02 UPDATE retention on FIN_DISK — 2 versions → 0`,ok:true,why:`The attacker had backup admin credentials. The immutable pool held, but the ordinary disk pool's retention was cut.`},
  {cmd:`Run a new full backup of fs01 now`,out:`Backup of encrypted data completed — 0% dedup, 1.2 TB`,ok:false,why:`You just backed up encrypted files, and with retention cut it may push good versions out.`},
  {cmd:`Assume backups are fine; the backup server is separate`,out:`(no information gained)`,ok:false,why:`Attackers go after backups first. Check, don't assume.`}]},
 {q:`Pick the restore point.`,opts:[
  {cmd:`Find the earliest sign of compromise in EDR and logs, then pick an immutable version from before it`,out:`First malicious login: 14 Nov 23:40 (stolen VPN account)
Chosen: FIN_IMMUTABLE version from 14 Nov 20:00`,ok:true,why:`The attacker was inside for days. Restoring from before the intrusion avoids bringing their tools back.`},
  {cmd:`Restore last night's version`,out:`Restored files include a scheduled task that launches the encryptor at 02:00.`,ok:false,why:`Last night's backup already contained the attacker's persistence.`},
  {cmd:`Pay the ransom for the decryptor`,out:`(not your call, and no guarantee it works)`,ok:false,why:`Leadership and legal decide that. Your job is to show whether clean recovery is possible.`}]},
 {q:`Where do you restore it?`,opts:[
  {cmd:`Restore into an isolated clean-room network, scan it, rotate credentials, then promote to production`,out:`Scan clean. bkp_svc and VPN credentials rotated, MFA enforced. Finance share back by 09:30.`,ok:true,why:`Proving the data is clean before reconnecting prevents re-infection.`},
  {cmd:`Restore straight onto the original fs01`,out:`fs01 still has the attacker's scheduled task. Re-encrypted at 10:00.`,ok:false,why:`The compromised host and credentials are still in play.`},
  {cmd:`Email the files to the finance team`,out:`(1.2 TB — not possible; also a data-handling breach)`,ok:false,why:`Not a recovery method.`}]}],
 root:`A stolen VPN account led to backup admin credentials. The attacker cut normal backup retention and encrypted the file servers; only the retention-locked pool survived.`,
 fix:`Restore from the immutable copy in a clean room. Separate backup admin accounts from the domain with MFA. Require a second approver for retention changes and deletes. Alert on retention changes and logins from unusual hosts. Run a ransomware recovery drill every quarter.`},
{id:'badrel',title:`Release broke another service`,brief:`10 minutes after orders v4.2 went out, the error rate on the invoices service jumps to 8%. The orders service itself looks healthy.`,steps:[
 {q:`Find out what's failing.`,opts:[
  {cmd:`kubectl logs deploy/invoices --since=15m | grep -i error | sort | uniq -c | sort -rn | head`,out:`  412 ERROR psycopg.errors.UndefinedColumn: column orders.cust_id does not exist`,ok:true,why:`invoices still reads cust_id, which the orders release no longer has.`},
  {cmd:`kubectl rollout restart deploy/invoices`,out:`(errors continue at 8%)`,ok:false,why:`Restarting without a hypothesis changes nothing.`},
  {cmd:`kubectl top pods -n invoices`,out:`cpu 12%  mem 40%`,ok:false,why:`It isn't a resource problem.`}]},
 {q:`What did orders v4.2 change?`,opts:[
  {cmd:`git diff v4.1..v4.2 -- migrations/`,out:`ALTER TABLE orders RENAME COLUMN cust_id TO customer_id;`,ok:true,why:`A one-step rename. Every other reader of that column broke the moment the migration ran.`},
  {cmd:`Check the load balancer`,out:`(healthy)`,ok:false,why:`The failure is in the database schema, not traffic.`},
  {cmd:`Ask in the team channel and wait`,out:`(no reply for 20 minutes)`,ok:false,why:`Look at the change yourself; the diff answers it in seconds.`}]},
 {q:`Mitigate. The error rate is still 8%.`,opts:[
  {cmd:`kubectl rollout undo deploy/orders`,out:`orders pods → CrashLoopBackOff: column orders.cust_id does not exist`,ok:false,why:`The schema already moved forward, so the old orders code can't run either. Rollback isn't safe after a destructive migration.`},
  {cmd:`Apply the reviewed hotfix migration: add cust_id back as a generated column mirroring customer_id`,out:`ALTER TABLE orders ADD COLUMN cust_id bigint GENERATED ALWAYS AS (customer_id) STORED;
invoices error rate 8% → 0.1% in 2 minutes`,ok:true,why:`Rolling forward to a compatible schema fixes both services with no data loss.`},
  {cmd:`Restore the orders database from last night's backup`,out:`(would lose today's orders and take 2 hours)`,ok:false,why:`Data loss and a long outage for a schema problem.`}]},
 {q:`What stops this happening again?`,opts:[
  {cmd:`Expand/contract migrations over two releases, plus a CI check that flags destructive migrations and contract tests for shared tables`,out:`Pipeline now fails on RENAME/DROP COLUMN without an approved plan.`,ok:true,why:`Old and new code can both run at every step, so rollback always works.`},
  {cmd:`Freeze all releases for a month`,out:`(lead time grows; the risk is unchanged)`,ok:false,why:`It doesn't fix how changes are made.`},
  {cmd:`Add a manual QA sign-off for every release`,out:`(slower, and QA wouldn't have tested invoices)`,ok:false,why:`The gap was cross-service compatibility, which a contract test catches automatically.`}]}],
 root:`orders v4.2 renamed a shared column in one migration, breaking the invoices service and making a rollback of orders impossible.`,
 fix:`Roll forward with a compatible column. Adopt expand/contract migrations, block destructive migrations in CI without a plan, and add contract tests for any table another service reads.`});
ROLES.push({id:'rel',name:`Release / build engineer`,sum:`Makes shipping safe and repeatable: CI/CD pipelines, versioning, artefact repositories, branching, rollouts and rollback. Your CI/CD jobs, multi-platform release validation and restore-guard's pipeline are direct evidence.`,
 rounds:[`Recruiter / HR screen`,`Technical — Git, CI/CD, build tools, scripting`,`Deep dive — pipeline design, artefacts, branching and versioning`,`Scenario — a bad release, a broken pipeline or a slow build`,`Behavioural — working with many teams, release-day pressure`],
 skills:[`Git: branching, cherry-pick, tags, bisect`,`Pipeline design: Jenkins and GitHub Actions`,`Build once, promote; artefact repositories`,`Semantic versioning and release notes`,`Rollouts: rolling, blue-green, canary, flags`,`Rollback and expand/contract migrations`,`Docker images and registries`,`Helm and GitOps`,`Supply-chain security: SBOM, signing, provenance`,`Python and Bash for build tooling`],
 lessons:['o3','o6','o19','o24','o25','o26','o4','o22','o8','k13','o15'],decks:['rel','ops','scn','rep'],certs:`Not essential. A public repo with a real pipeline (restore-guard) proves more; GitHub Actions or Jenkins certifications are optional extras.`,
 links:[[`Google SRE book — Release engineering`,`https://sre.google/sre-book/release-engineering/`],[`Semantic Versioning 2.0.0`,`https://semver.org/`],[`Trunk-based development`,`https://trunkbaseddevelopment.com/`],[`SLSA`,`https://slsa.dev/`]]});
{const r=ROLES.find(x=>x.id==='res');['s10','s11','s12','k14','k17'].forEach(l=>{if(!r.lessons.includes(l))r.lessons.push(l)});}
SYL.rel={lvl:'Release / build engineer: expected to own pipelines and releases end to end and make shipping boring.',items:[
['Git & branching','must','Trunk-based vs GitFlow, cherry-pick hotfixes, tags, bisect, revert.',['o3','o24'],'5'],
['CI/CD pipelines','must','Jenkins and GitHub Actions: stages, caching, matrices, secrets, speed.',['o6','o19','k13'],'5'],
['Artefacts & versioning','must','Build once, promote; registries and repositories; semver; deploy by digest.',['o24','o4'],'5'],
['Rollouts & rollback','must','Rolling, blue-green, canary, flags; expand/contract migrations.',['o25','o8','o22'],'5–6'],
['Supply-chain security','strong','Pinning, SBOM, signing, provenance, OIDC credentials in CI.',['o26'],'8'],
['Infrastructure as code','plus','Terraform modules and state for pipeline infrastructure.',['o15'],'6']]};
SYL.res.items.push(
['Cyber resilience & ransomware recovery','must','Immutable and isolated copies, clean restore points, recovery order.',['s10','s8'],'3, 8'],
['DR testing & failover','must','Tabletop to full failover; measure RTO; failback and split-brain.',['s11','k17'],'3'],
['Backup software internals','strong','Client/server/catalog, incremental-forever, synthetic fulls, retention.',['s12'],'3']);
{const add=(w,items)=>{if(PLAN90[w])items.forEach(it=>PLAN90[w][1].push(it))};
add(3,[['l','s11'],['l','s12']]);add(5,[['l','o24'],['l','o25'],['s','badrel']]);add(7,[['l','s10'],['s','ransom']]);add(8,[['l','o26']]);}
[['s10',T('explain',`The CISO asks: "If ransomware hit us tonight, could we recover?" How do you answer, and how do you prove it?`,`Answer with evidence, not reassurance: which systems have an immutable or isolated copy inside their RPO; whether backup admin accounts are separate from the domain with MFA; when we last restored a critical system in a clean environment and how long it took against the RTO; the recovery order; and the gaps with owners and dates. Then run a timed ransomware recovery drill to prove it.`,{rubric:[`Gives evidence, not a yes/no`,`Mentions immutable or isolated copies`,`Mentions separate backup credentials / MFA`,`Cites a measured restore time against RTO`,`Proposes a drill and names the gaps`]})],
 ['s12',T('explain',`A nightly backup that took 2 hours now takes 9. How do you investigate?`,`Compare against when it was fast: data volume, file count and change rate. Time each stage: client read, network, server ingest, storage write. Look for overlaps with other jobs or with storage maintenance, a full storage pool, client-side issues such as antivirus or millions of small files, and errors or retries in the logs. Fix the bottleneck, then alert on duration.`,{rubric:[`Compares with a known-good baseline`,`Breaks the job into stages`,`Checks overlap/scheduling and storage health`,`Uses logs and metrics, not guesses`,`Adds an alert on duration`]})],
 ['o24',T('explain',`Design the release process for a service that ships weekly and sometimes needs hotfixes.`,`Trunk-based with short-lived branches and flags. CI builds an immutable, versioned artefact once and promotes it through staging to production by digest. Releases are tagged with semver. A hotfix is fixed on main and cherry-picked to the release branch, run through the same pipeline and tagged as a patch. Production rollout is a canary with automatic rollback, and release notes are generated from commits.`,{rubric:[`Build once, promote the same artefact`,`Versioning and tags`,`A hotfix path that doesn't lose the fix`,`Safe rollout with rollback`,`Automation over manual steps`]})],
 ['o25',T('explain',`A release needs a database schema change. How do you keep it safe to roll back?`,`Expand and contract over several releases: add the new column or table and write to both; backfill; switch reads; only later drop the old one. Every release stays compatible with the previous app version. Test the migration on production-like data, make it non-blocking (online index builds), and roll the app out with a canary.`,{rubric:[`Expand/contract in multiple releases`,`Old and new versions both work at each step`,`Backfill step`,`Tests the migration on realistic data`,`Non-blocking migration / canary`]})],
 ['o26',T('explain',`How would you secure a CI/CD pipeline end to end?`,`Protect main with reviews and required checks. Pin and scan dependencies. Build in ephemeral runners. Use OIDC for short-lived, least-privilege cloud credentials instead of stored keys. Keep secrets out of logs and away from untrusted pull requests. Generate an SBOM, sign artefacts and attach provenance. At deploy time, verify signatures and policy before anything runs.`,{rubric:[`Branch protection / reviews`,`Dependency pinning and scanning`,`Short-lived credentials (OIDC), least privilege`,`SBOM, signing and provenance`,`Verification at deploy time`]})]
].forEach(([id,t])=>{const l=ALL.find(x=>x.id===id);if(l){t.k=l.id+':'+l.steps.length;l.steps.push(t)}});
GUIDES.push(
{id:'ransomrun',cat:'Technical cheat sheets',title:'Ransomware recovery runbook',sum:'The order of moves interviewers expect, from first alert to lessons learned.',body:`
<h3>First hour</h3>
<pre>1 Contain     isolate affected hosts (EDR quarantine), keep them powered on
2 Protect     lock down the backup system: check admin logins, deletes, retention changes
3 Declare     incident commander, comms lead, legal/security informed
4 Preserve    logs, memory, disk images for forensics</pre>
<h3>Choosing what to restore</h3>
<pre>Find the earliest indicator of compromise (EDR, auth logs, VPN)
Pick an immutable / isolated version from BEFORE it
Restore to an isolated clean room → scan → verify (checksums, app checks)
Rotate credentials (backup admins, service accounts, VPN) before reconnecting</pre>
<h3>Recovery order</h3>
<pre>Identity & DNS → network & security tools → backup server → databases → tier-1 apps → the rest</pre>
<h3>Before it happens</h3>
<ul><li>3-2-1-1-0: one copy immutable or offline; zero errors on restore tests.</li>
<li>Backup admin accounts outside the domain, MFA, and a second approver for deletes and retention changes.</li>
<li>Alerts on retention changes, unusual admin logins and sudden dedup or compression drops.</li>
<li>A quarterly timed recovery drill, measured against the RTO.</li></ul>
<p class="note">Sources: CISA #StopRansomware Guide; NIST SP 1800-11.</p>`},
{id:'releng',cat:'Technical cheat sheets',title:'Release engineering one-pager',sum:'Versioning, branching, artefacts, rollouts and rollback on one screen.',body:`
<h3>Versioning (semver)</h3>
<pre>MAJOR.MINOR.PATCH   breaking . feature . fix
2.0.0-rc.1 &lt; 2.0.0  pre-releases rank lower
1.4.2+sha.9f2c      build metadata: ignored for ordering</pre>
<h3>Branching</h3>
<pre>Trunk-based  short branches → main daily; flags hide unfinished work
Release br.  cut from main; only fixes go in; tag each patch
Hotfix       fix on main → cherry-pick to release branch → tag x.y.(z+1)</pre>
<h3>Artefacts</h3>
<pre>Build once → push to registry/repository → promote the same digest
Deploy images by digest:  app@sha256:…   never by "latest"</pre>
<h3>Rollouts</h3>
<pre>Rolling     cheap, slower undo
Blue-green  instant switch back, double capacity
Canary      1–10% first; auto-rollback on error/latency
Flags       deploy ≠ release; kill switch</pre>
<h3>Rollback-safe database changes</h3>
<pre>Expand (add + dual write) → backfill → switch reads → Contract (drop old) in a LATER release</pre>
<h3>Supply chain</h3>
<pre>Pin + scan dependencies · SBOM (SPDX/CycloneDX) · sign (cosign) · SLSA provenance · OIDC creds</pre>
<h3>Metrics</h3>
<pre>DORA: deployment frequency · lead time · change failure rate · recovery time from failed deploys</pre>`});

/* ---------- Focus roles: DevOps / SRE / SDET depth + LeetCode list (Nov 2026) ---------- */
{const add=(tr,arr)=>{const n=CARDS.filter(c=>c.tr===tr).length;arr.forEach(([q,a],i)=>CARDS.push({k:tr+(n+i),tr,q,a}))};
add('ops',[
[`Docker CMD vs ENTRYPOINT?`,`ENTRYPOINT is the executable that always runs; CMD supplies default arguments (or the default command if there's no ENTRYPOINT). Arguments to docker run replace CMD but not ENTRYPOINT. Use exec form (JSON array) so the process is PID 1 and receives signals.`],
[`COPY vs ADD in a Dockerfile?`,`COPY copies local files. ADD can also fetch URLs and auto-extract local tar archives. Prefer COPY: it's explicit and predictable, and use ADD only when you need the extraction.`],
[`How does Docker layer caching work, and how do you use it?`,`Each instruction creates a layer; if an instruction and its inputs haven't changed, the cached layer is reused, and everything after a change is rebuilt. Order from least to most frequently changing: copy the dependency manifest and install dependencies before copying the source code.`],
[`Deployment vs StatefulSet vs DaemonSet?`,`Deployment: interchangeable replicas for stateless apps, rolling updates. StatefulSet: stable names (pod-0, pod-1), ordered start-up and a volume per pod, for databases and clustered apps. DaemonSet: one pod per node, for log shippers, monitoring agents and CNI.`],
[`Liveness vs readiness vs startup probes?`,`Readiness decides whether a pod gets traffic: failing removes it from the Service. Liveness decides whether to restart it: failing kills the container. Startup delays the other two until a slow app has started. A liveness probe that checks a dependency causes restart storms; keep it to "is this process alive".`],
[`A pod is Pending. What do you check?`,`kubectl describe pod and read Events: insufficient CPU or memory for the requests, a node selector, affinity or taint nobody tolerates, a PVC that can't bind, or an image pull secret. Fix the cause: adjust requests, add nodes, fix the selector or storage class.`],
[`What does OOMKilled mean, and how do you fix it?`,`The container went over its memory limit and the kernel killed it (exit code 137). Check memory usage against the limit, look for a leak or a traffic spike, then raise the limit to match real usage or fix the leak. Set requests near normal usage and limits with headroom.`],
[`Requests vs limits in Kubernetes?`,`Requests are what the scheduler reserves to place the pod. Limits are the ceiling at runtime: going over the CPU limit throttles the container, going over the memory limit gets it OOM-killed. Requests set the QoS class; Guaranteed means requests equal limits.`],
[`How do you roll back a Kubernetes deployment?`,`kubectl rollout undo deployment/app (or --to-revision=N), then watch kubectl rollout status. Better: keep image tags immutable and let GitOps revert the commit, so Git stays the source of truth.`],
[`terraform plan vs apply, and why remote state?`,`plan compares code with state and real resources and shows the changes; apply makes them. Remote state (S3 with locking, Terraform Cloud) lets a team share one state, lock it during applies so two people can't corrupt it, and keep secrets out of laptops.`],
[`How do you structure Terraform for dev, staging and prod?`,`Reusable modules for components, with a thin root configuration per environment that passes different variables, and separate state per environment (separate backends or keys). Pin module and provider versions. Promote changes dev → staging → prod through CI with a plan reviewed in the pull request.`],
[`git merge vs rebase?`,`Merge keeps history as it happened and adds a merge commit. Rebase replays your commits on top of the target for a linear history. Rebase your own unpublished branch; never rebase shared branches, because it rewrites commits others already have.`],
[`How do you find which commit broke something?`,`git bisect: mark a known good and a known bad commit, Git checks out the middle, you test and mark good or bad, and it halves the range each time. With a test script, git bisect run finds it automatically.`],
[`A Linux server is slow. Walk through your first commands.`,`uptime (load vs CPU count), top or htop (CPU, memory, which process), free -m (memory and swap), df -h and df -i (disk and inodes), iostat -x (disk wait), vmstat 1, ss -s (connections), then dmesg -T and the app logs. Find which resource is saturated before changing anything.`]]);
add('auto',[
[`Implicit vs explicit waits in Selenium? Why avoid sleep?`,`Implicit wait applies to every element lookup globally. Explicit waits (WebDriverWait with expected conditions) wait for a specific condition on a specific element. Prefer explicit waits and don't mix both. Fixed sleeps are slow and still flaky, because the time you need varies.`],
[`Selenium vs Playwright?`,`Selenium: W3C WebDriver standard, every major language and browser, a huge ecosystem and grid. Playwright: auto-waiting, browser contexts for isolation, network interception, tracing, and faster, more stable tests. New projects often choose Playwright; many enterprises run Selenium. Know both and why you'd pick one.`],
[`What is the Page Object Model?`,`One class per page or component that wraps its locators and actions, so tests read as user steps and a UI change is fixed in one place. Keep assertions in tests, not page objects, and prefer stable locators (data-testid, roles) over brittle XPath.`],
[`How do you choose good locators?`,`Prefer dedicated test IDs or accessible roles and labels, then stable IDs, then CSS. Avoid absolute XPath and text that changes with copy or language. Agree on data-testid attributes with developers.`],
[`Explain the test pyramid.`,`Many fast unit tests at the base, fewer integration and API tests in the middle, few slow end-to-end UI tests at the top. It keeps feedback fast and failures easy to locate. An "ice-cream cone" of mostly UI tests is slow and flaky.`],
[`How do you write a test strategy for a new feature?`,`Understand the requirements and the risks first. Decide scope and levels (unit, API, UI, performance, security), the test data and environments, what to automate versus explore manually, entry and exit criteria, and how results are reported. Agree it with developers and the product owner before testing starts.`],
[`How do you do data-driven testing in pytest?`,`@pytest.mark.parametrize runs one test over many inputs; use ids for readable names. Fixtures with params handle setup variations. For large data sets, load from a CSV or JSON file in a fixture and keep the data in version control.`],
[`How do you validate an API response properly?`,`Check the status code, headers (content type), and response time, then validate the body against a schema (JSON Schema or pydantic), then the business values. Test negative cases: missing fields, wrong types, auth failures, boundary values. Clean up any data you created.`],
[`How do you handle test data and environments?`,`Create the data each test needs through APIs or fixtures, make it unique (UUIDs) so parallel runs don't collide, and clean it up. Avoid depending on shared, hand-made data. Keep environment config (URLs, credentials) outside the code, in variables or secrets.`],
[`What is contract testing?`,`Each consumer records the requests it makes and the responses it expects (a contract, for example with Pact). The provider's CI verifies it still honours every consumer's contract, so a breaking API change fails before deployment, without slow end-to-end environments.`],
[`How would you load-test an API?`,`Define the goal (target RPS and latency SLO). Write realistic user scenarios in a tool such as Locust, k6 or JMeter. Ramp up gradually in a production-like environment. Watch latency percentiles, error rate and server saturation. Report the breaking point and the bottleneck, not just averages.`],
[`How do you report automation results so people act on them?`,`Publish results in CI (JUnit XML plus an HTML report such as Allure), with screenshots, logs and traces on failure. Track trends: pass rate, duration and flaky tests. Send failures to the owning team with enough context to reproduce.`],
[`Which OOP concepts does a test framework use?`,`Encapsulation in page objects and API clients. Inheritance for a base test or base page with shared setup. Polymorphism for one interface over several browsers or environments. Abstraction so tests call business actions, not raw driver calls. Composition is often better than deep inheritance.`],
[`How do you test something that sends an email or calls a third-party API?`,`Unit level: mock the client and assert it was called correctly. Integration level: point to a stub server or sandbox (for example MailHog for email, or WireMock) and check what it received. Keep one smoke test against the real service, outside the main pipeline.`]]);
add('scn',[
[`Memory on a service grows steadily until pods restart. What do you do?`,`Confirm the pattern on memory graphs (a sawtooth that resets on restart suggests a leak). Mitigate: raise the limit or schedule restarts to buy time. Find it: compare heap snapshots or profiles over time, check caches without limits, unbounded queues and connections that are never closed, and the recent deploys that line up with the start.`],
[`A TLS certificate expired in production. Handle it and prevent it.`,`Mitigate first: issue and deploy a new certificate, then confirm the full chain from outside with openssl s_client. Then prevent it: automate issuance and renewal (cert-manager, ACME), monitor expiry and alert 30 and 7 days ahead, and keep an inventory of every certificate.`],
[`Users report intermittent DNS failures. How do you debug?`,`Reproduce with dig against each resolver and note which fail and when. Check resolver health, rate limits and timeouts. In Kubernetes, check CoreDNS pods, their CPU throttling and the ndots/search-path setting that multiplies lookups. Look for conntrack table exhaustion on nodes. Fix the cause and add DNS latency and error alerts.`],
[`The error budget for a service is almost spent. What happens now?`,`Follow the error budget policy agreed in advance: slow or freeze risky feature releases, prioritise reliability work from the latest incidents and top error sources, and review with the product owner. When the budget recovers, release pace goes back to normal.`],
[`How do you plan capacity for a service?`,`Measure current demand and the resource each unit of demand uses, forecast growth (business plans, seasonality), add headroom for failures (N+1 or one zone down) and spikes, and load-test to confirm the real limit. Review regularly and automate scaling where you can.`],
[`What is toil, and how do you reduce it?`,`Manual, repetitive, automatable work with no lasting value that grows with the service. Measure where on-call time goes, then automate the biggest items first: self-healing, runbook automation, better alerts. Google's SRE book suggests keeping toil under half of an SRE's time.`],
[`Write the structure of a good postmortem.`,`Summary and impact (who, how long, how bad); a timeline; root cause and contributing factors; what went well and what didn't; and action items with owners and dates. Keep it blameless and focused on systems. Share it widely, and track the actions to completion.`],
[`A deploy succeeded, but one zone's pods fail health checks. Why might that be?`,`Something differs by zone: a zone-specific dependency (database replica, cache node), a subnet without a route or NAT, a security group or network policy, a node image or kernel difference, or an AZ outage. Compare a healthy and a failing pod's networking and dependencies side by side.`],
[`Load is high, but CPU usage is low. What's going on?`,`Load counts processes waiting to run or for uninterruptible I/O. Low CPU with high load usually means I/O wait: a slow disk, an NFS server or storage latency. Check iostat -x (await, %util), vmstat (wa column) and processes in D state.`],
[`An alert fires: 5xx rate is 10% on the API. Walk through the first 10 minutes.`,`Acknowledge and declare an incident. Check scope: which endpoints, regions and versions. Check what changed (deploys, config, dependencies). If a deploy lines up, roll back. Otherwise look at the logs and traces of failing requests and at dependency health. Communicate status on a schedule, and confirm recovery on the metric.`]]);}
{const r=ROLES.find(x=>x.id==='sdet');if(r&&!r.lessons.includes('a10'))r.lessons.push('a10');}
if(SYL.sdet)SYL.sdet.items.push(['Performance & contract testing','strong','Load, stress, spike and soak tests; percentiles; Locust/k6; Pact.',['a10'],'7']);
{const w=PLAN90[6];if(w)w[1].push(['l','a10']);}

/* Curated LeetCode list for DevOps / SRE / SDET interviews: patterns over volume.
   Free problems only. Week = which plan week to do it in. */
const LC=[
// week 1–2: arrays, strings, hash maps
['two-sum','Two Sum','Easy','Hash map',1],['contains-duplicate','Contains Duplicate','Easy','Hash set',1],['valid-anagram','Valid Anagram','Easy','Counting',1],
['first-unique-character-in-a-string','First Unique Character in a String','Easy','Counting',1],['roman-to-integer','Roman to Integer','Easy','Strings',1],
['longest-common-prefix','Longest Common Prefix','Easy','Strings',1],['move-zeroes','Move Zeroes','Easy','Two pointers',2],['valid-palindrome','Valid Palindrome','Easy','Two pointers',2],
['best-time-to-buy-and-sell-stock','Best Time to Buy and Sell Stock','Easy','One pass',2],['majority-element','Majority Element','Easy','Counting',2],
['group-anagrams','Group Anagrams','Medium','Hash map',2],['top-k-frequent-elements','Top K Frequent Elements','Medium','Counter / heap',2],
// week 3–4: two pointers, sliding window, stacks
['valid-parentheses','Valid Parentheses','Easy','Stack',3],['min-stack','Min Stack','Medium','Stack design',3],['implement-queue-using-stacks','Implement Queue using Stacks','Easy','Stack design',3],
['simplify-path','Simplify Path','Medium','Stack · Unix paths',3],['evaluate-reverse-polish-notation','Evaluate Reverse Polish Notation','Medium','Stack',3],
['longest-substring-without-repeating-characters','Longest Substring Without Repeating Characters','Medium','Sliding window',4],['container-with-most-water','Container With Most Water','Medium','Two pointers',4],
['product-of-array-except-self','Product of Array Except Self','Medium','Prefix/suffix',4],['3sum','3Sum','Medium','Two pointers',4],['string-compression','String Compression','Medium','Two pointers',4],
// week 5–6: intervals, sorting, binary search, linked lists
['merge-intervals','Merge Intervals','Medium','Intervals',5],['insert-interval','Insert Interval','Medium','Intervals',5],['binary-search','Binary Search','Easy','Binary search',5],
['search-in-rotated-sorted-array','Search in Rotated Sorted Array','Medium','Binary search',5],['find-minimum-in-rotated-sorted-array','Find Minimum in Rotated Sorted Array','Medium','Binary search',6],
['reverse-linked-list','Reverse Linked List','Easy','Linked list',6],['merge-two-sorted-lists','Merge Two Sorted Lists','Easy','Linked list',6],['linked-list-cycle','Linked List Cycle','Easy','Fast/slow pointers',6],
// week 7–8: design, heaps, scheduling
['lru-cache','LRU Cache','Medium','Design · OrderedDict',7],['time-based-key-value-store','Time Based Key-Value Store','Medium','Design · binary search',7],
['kth-largest-element-in-an-array','Kth Largest Element in an Array','Medium','Heap',7],['task-scheduler','Task Scheduler','Medium','Greedy / counting',8],
['daily-temperatures','Daily Temperatures','Medium','Monotonic stack',8],['validate-ip-address','Validate IP Address','Medium','Strings · networking',8],
// week 9–10: trees, graphs, simple DP
['maximum-depth-of-binary-tree','Maximum Depth of Binary Tree','Easy','Tree DFS',9],['invert-binary-tree','Invert Binary Tree','Easy','Tree',9],
['binary-tree-level-order-traversal','Binary Tree Level Order Traversal','Medium','BFS',9],['number-of-islands','Number of Islands','Medium','Grid BFS/DFS',10],
['course-schedule','Course Schedule','Medium','Topological sort · dependencies',10],['climbing-stairs','Climbing Stairs','Easy','DP',10],['coin-change','Coin Change','Medium','DP',10],
// shell and SQL rounds (DevOps/SRE screens ask these)
['word-frequency','Word Frequency (Bash)','Medium','Bash pipeline',3],['tenth-line','Tenth Line (Bash)','Easy','Bash',3],['valid-phone-numbers','Valid Phone Numbers (Bash)','Easy','grep / regex',3],['transpose-file','Transpose File (Bash)','Medium','awk',4],
['combine-two-tables','Combine Two Tables (SQL)','Easy','LEFT JOIN',5],['second-highest-salary','Second Highest Salary (SQL)','Medium','Subquery / LIMIT',5],
['duplicate-emails','Duplicate Emails (SQL)','Easy','GROUP BY HAVING',5],['customers-who-never-order','Customers Who Never Order (SQL)','Easy','Anti-join',6],
['department-highest-salary','Department Highest Salary (SQL)','Medium','JOIN + window/subquery',6],['rising-temperature','Rising Temperature (SQL)','Easy','Self-join on dates',6]];

/* LeetCode solutions: written and tested for CodeTrail (Python run against sample cases; Bash and SQL checked on sample data). */
const LC_SOL={"two-sum": ["One pass with a dict of value → index; for each number check whether target − number was already seen.", "O(n) time, O(n) space", "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, x in enumerate(nums):\n            if target - x in seen:\n                return [seen[target - x], i]\n            seen[x] = i", "python"], "contains-duplicate": ["A set removes duplicates, so compare lengths (or stop at the first repeat).", "O(n) time, O(n) space", "class Solution:\n    def containsDuplicate(self, nums):\n        return len(set(nums)) != len(nums)", "python"], "valid-anagram": ["Two strings are anagrams when every character appears the same number of times.", "O(n) time, O(1) space (bounded alphabet)", "from collections import Counter\n\nclass Solution:\n    def isAnagram(self, s, t):\n        return len(s) == len(t) and Counter(s) == Counter(t)", "python"], "first-unique-character-in-a-string": ["Count characters, then scan again and return the first index whose count is 1.", "O(n) time, O(1) space", "from collections import Counter\n\nclass Solution:\n    def firstUniqChar(self, s):\n        count = Counter(s)\n        for i, ch in enumerate(s):\n            if count[ch] == 1:\n                return i\n        return -1", "python"], "roman-to-integer": ["Add each value, but subtract it when a larger value follows (IV, IX, XL…).", "O(n) time, O(1) space", "class Solution:\n    def romanToInt(self, s):\n        v = {\"I\": 1, \"V\": 5, \"X\": 10, \"L\": 50, \"C\": 100, \"D\": 500, \"M\": 1000}\n        total = 0\n        for i, ch in enumerate(s):\n            if i + 1 < len(s) and v[ch] < v[s[i + 1]]:\n                total -= v[ch]\n            else:\n                total += v[ch]\n        return total", "python"], "longest-common-prefix": ["Compare the lexicographically smallest and largest strings; their common prefix is everyone's.", "O(n·m) time, O(1) extra space", "class Solution:\n    def longestCommonPrefix(self, strs):\n        if not strs:\n            return \"\"\n        a, b = min(strs), max(strs)\n        i = 0\n        while i < len(a) and a[i] == b[i]:\n            i += 1\n        return a[:i]", "python"], "move-zeroes": ["Keep a write pointer: copy each non-zero forward by swapping, so zeros drift to the end in place.", "O(n) time, O(1) space", "class Solution:\n    def moveZeroes(self, nums):\n        w = 0\n        for r in range(len(nums)):\n            if nums[r] != 0:\n                nums[w], nums[r] = nums[r], nums[w]\n                w += 1", "python"], "valid-palindrome": ["Two pointers from both ends, skipping non-alphanumeric characters and comparing lower-case.", "O(n) time, O(1) space", "class Solution:\n    def isPalindrome(self, s):\n        i, j = 0, len(s) - 1\n        while i < j:\n            if not s[i].isalnum():\n                i += 1\n            elif not s[j].isalnum():\n                j -= 1\n            else:\n                if s[i].lower() != s[j].lower():\n                    return False\n                i += 1\n                j -= 1\n        return True", "python"], "best-time-to-buy-and-sell-stock": ["Track the lowest price so far; the best profit is the max of price − lowest.", "O(n) time, O(1) space", "class Solution:\n    def maxProfit(self, prices):\n        lowest, best = float(\"inf\"), 0\n        for p in prices:\n            lowest = min(lowest, p)\n            best = max(best, p - lowest)\n        return best", "python"], "majority-element": ["Boyer–Moore voting: keep a candidate and a count; the majority survives the cancellations.", "O(n) time, O(1) space", "class Solution:\n    def majorityElement(self, nums):\n        cand, count = None, 0\n        for x in nums:\n            if count == 0:\n                cand = x\n            count += 1 if x == cand else -1\n        return cand", "python"], "group-anagrams": ["Anagrams share the same sorted letters; group by that key in a dict of lists.", "O(n·k log k) time, O(n·k) space", "from collections import defaultdict\n\nclass Solution:\n    def groupAnagrams(self, strs):\n        groups = defaultdict(list)\n        for s in strs:\n            groups[\"\".join(sorted(s))].append(s)\n        return list(groups.values())", "python"], "top-k-frequent-elements": ["Count with Counter, then take the k most common (a heap underneath).", "O(n log k) time, O(n) space", "from collections import Counter\n\nclass Solution:\n    def topKFrequent(self, nums, k):\n        return [x for x, _ in Counter(nums).most_common(k)]", "python"], "valid-parentheses": ["Push openers on a stack; each closer must match the top.", "O(n) time, O(n) space", "class Solution:\n    def isValid(self, s):\n        pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n        stack = []\n        for ch in s:\n            if ch in pairs:\n                if not stack or stack.pop() != pairs[ch]:\n                    return False\n            else:\n                stack.append(ch)\n        return not stack", "python"], "min-stack": ["Store (value, current minimum) pairs so getMin is the top's second item.", "O(1) per operation, O(n) space", "class MinStack:\n    def __init__(self):\n        self.st = []\n\n    def push(self, val):\n        m = min(val, self.st[-1][1]) if self.st else val\n        self.st.append((val, m))\n\n    def pop(self):\n        self.st.pop()\n\n    def top(self):\n        return self.st[-1][0]\n\n    def getMin(self):\n        return self.st[-1][1]", "python"], "implement-queue-using-stacks": ["Push onto an in-stack; when popping, refill the out-stack only when it's empty (amortised O(1)).", "Amortised O(1) per operation", "class MyQueue:\n    def __init__(self):\n        self.inn, self.out = [], []\n\n    def push(self, x):\n        self.inn.append(x)\n\n    def _move(self):\n        if not self.out:\n            while self.inn:\n                self.out.append(self.inn.pop())\n\n    def pop(self):\n        self._move()\n        return self.out.pop()\n\n    def peek(self):\n        self._move()\n        return self.out[-1]\n\n    def empty(self):\n        return not self.inn and not self.out", "python"], "simplify-path": ["Split on \"/\", use a stack: skip \"\" and \".\", pop on \"..\", push names. Join with \"/\".", "O(n) time, O(n) space", "class Solution:\n    def simplifyPath(self, path):\n        stack = []\n        for part in path.split(\"/\"):\n            if part == \"..\":\n                if stack:\n                    stack.pop()\n            elif part and part != \".\":\n                stack.append(part)\n        return \"/\" + \"/\".join(stack)", "python"], "evaluate-reverse-polish-notation": ["Stack of numbers; on an operator pop two, apply, push. Division truncates toward zero.", "O(n) time, O(n) space", "class Solution:\n    def evalRPN(self, tokens):\n        st = []\n        for t in tokens:\n            if t in \"+-*/\":\n                b, a = st.pop(), st.pop()\n                if t == \"+\": st.append(a + b)\n                elif t == \"-\": st.append(a - b)\n                elif t == \"*\": st.append(a * b)\n                else: st.append(int(a / b))\n            else:\n                st.append(int(t))\n        return st[0]", "python"], "longest-substring-without-repeating-characters": ["Sliding window: remember each character's last index; when it repeats inside the window, move the left edge past it.", "O(n) time, O(min(n, alphabet)) space", "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        last, left, best = {}, 0, 0\n        for right, ch in enumerate(s):\n            if ch in last and last[ch] >= left:\n                left = last[ch] + 1\n            last[ch] = right\n            best = max(best, right - left + 1)\n        return best", "python"], "container-with-most-water": ["Two pointers at the ends; area is limited by the shorter wall, so move that pointer inward.", "O(n) time, O(1) space", "class Solution:\n    def maxArea(self, height):\n        i, j, best = 0, len(height) - 1, 0\n        while i < j:\n            best = max(best, (j - i) * min(height[i], height[j]))\n            if height[i] < height[j]:\n                i += 1\n            else:\n                j -= 1\n        return best", "python"], "product-of-array-except-self": ["Fill the answer with prefix products left to right, then multiply in suffix products right to left. No division.", "O(n) time, O(1) extra space (output excluded)", "class Solution:\n    def productExceptSelf(self, nums):\n        n = len(nums)\n        out = [1] * n\n        p = 1\n        for i in range(n):\n            out[i] = p\n            p *= nums[i]\n        s = 1\n        for i in range(n - 1, -1, -1):\n            out[i] *= s\n            s *= nums[i]\n        return out", "python"], "3sum": ["Sort; fix each number, then two pointers find pairs summing to its negative. Skip duplicates at every level.", "O(n²) time, O(1) extra space (excluding sort)", "class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i and nums[i] == nums[i - 1]:\n                continue\n            lo, hi = i + 1, len(nums) - 1\n            while lo < hi:\n                s = nums[i] + nums[lo] + nums[hi]\n                if s < 0:\n                    lo += 1\n                elif s > 0:\n                    hi -= 1\n                else:\n                    res.append([nums[i], nums[lo], nums[hi]])\n                    lo += 1\n                    while lo < hi and nums[lo] == nums[lo - 1]:\n                        lo += 1\n        return res", "python"], "string-compression": ["Read pointer walks each run; write the character and, if the run is longer than 1, its count digits. Return the write length.", "O(n) time, O(1) space", "class Solution:\n    def compress(self, chars):\n        w = r = 0\n        while r < len(chars):\n            ch, start = chars[r], r\n            while r < len(chars) and chars[r] == ch:\n                r += 1\n            chars[w] = ch\n            w += 1\n            if r - start > 1:\n                for d in str(r - start):\n                    chars[w] = d\n                    w += 1\n        return w", "python"], "merge-intervals": ["Sort by start; extend the last merged interval when the next overlaps, otherwise append.", "O(n log n) time, O(n) space", "class Solution:\n    def merge(self, intervals):\n        intervals.sort(key=lambda x: x[0])\n        out = []\n        for s, e in intervals:\n            if out and s <= out[-1][1]:\n                out[-1][1] = max(out[-1][1], e)\n            else:\n                out.append([s, e])\n        return out", "python"], "insert-interval": ["Three phases: copy intervals ending before the new one, merge all that overlap it, copy the rest.", "O(n) time, O(n) space", "class Solution:\n    def insert(self, intervals, newInterval):\n        out, i, n = [], 0, len(intervals)\n        s, e = newInterval\n        while i < n and intervals[i][1] < s:\n            out.append(intervals[i]); i += 1\n        while i < n and intervals[i][0] <= e:\n            s = min(s, intervals[i][0]); e = max(e, intervals[i][1]); i += 1\n        out.append([s, e])\n        out.extend(intervals[i:])\n        return out", "python"], "binary-search": ["Classic lo/hi loop on a sorted array; halve the range each step.", "O(log n) time, O(1) space", "class Solution:\n    def search(self, nums, target):\n        lo, hi = 0, len(nums) - 1\n        while lo <= hi:\n            mid = (lo + hi) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[mid] < target:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n        return -1", "python"], "search-in-rotated-sorted-array": ["Binary search; one half is always sorted. If the target is inside the sorted half, search there, otherwise the other half.", "O(log n) time, O(1) space", "class Solution:\n    def search(self, nums, target):\n        lo, hi = 0, len(nums) - 1\n        while lo <= hi:\n            mid = (lo + hi) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[lo] <= nums[mid]:            # left half sorted\n                if nums[lo] <= target < nums[mid]:\n                    hi = mid - 1\n                else:\n                    lo = mid + 1\n            else:                                 # right half sorted\n                if nums[mid] < target <= nums[hi]:\n                    lo = mid + 1\n                else:\n                    hi = mid - 1\n        return -1", "python"], "find-minimum-in-rotated-sorted-array": ["Binary search comparing mid with the right end: if mid > right, the minimum is to the right, otherwise at mid or left.", "O(log n) time, O(1) space", "class Solution:\n    def findMin(self, nums):\n        lo, hi = 0, len(nums) - 1\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if nums[mid] > nums[hi]:\n                lo = mid + 1\n            else:\n                hi = mid\n        return nums[lo]", "python"], "reverse-linked-list": ["Walk the list, pointing each node back to the previous one.", "O(n) time, O(1) space", "class Solution:\n    def reverseList(self, head):\n        prev = None\n        while head:\n            head.next, prev, head = prev, head, head.next\n        return prev", "python"], "merge-two-sorted-lists": ["Dummy head; repeatedly attach the smaller node, then attach whatever remains.", "O(n + m) time, O(1) space", "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        dummy = tail = ListNode()\n        while list1 and list2:\n            if list1.val <= list2.val:\n                tail.next, list1 = list1, list1.next\n            else:\n                tail.next, list2 = list2, list2.next\n            tail = tail.next\n        tail.next = list1 or list2\n        return dummy.next", "python"], "linked-list-cycle": ["Floyd's fast/slow pointers: if there's a cycle the fast one laps the slow one.", "O(n) time, O(1) space", "class Solution:\n    def hasCycle(self, head):\n        slow = fast = head\n        while fast and fast.next:\n            slow, fast = slow.next, fast.next.next\n            if slow is fast:\n                return True\n        return False", "python"], "lru-cache": ["OrderedDict keeps usage order: move a key to the end on every get/put; evict from the front when over capacity.", "O(1) per operation, O(capacity) space", "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.d = OrderedDict()\n\n    def get(self, key):\n        if key not in self.d:\n            return -1\n        self.d.move_to_end(key)\n        return self.d[key]\n\n    def put(self, key, value):\n        if key in self.d:\n            self.d.move_to_end(key)\n        self.d[key] = value\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)", "python"], "time-based-key-value-store": ["Timestamps arrive increasing, so each key keeps an appended list; get() binary-searches for the latest timestamp ≤ the asked one.", "set O(1), get O(log n)", "import bisect\nfrom collections import defaultdict\n\nclass TimeMap:\n    def __init__(self):\n        self.times = defaultdict(list)\n        self.vals = defaultdict(list)\n\n    def set(self, key, value, timestamp):\n        self.times[key].append(timestamp)\n        self.vals[key].append(value)\n\n    def get(self, key, timestamp):\n        i = bisect.bisect_right(self.times[key], timestamp)\n        return self.vals[key][i - 1] if i else \"\"", "python"], "kth-largest-element-in-an-array": ["Keep a min-heap of size k; its top is the kth largest.", "O(n log k) time, O(k) space", "import heapq\n\nclass Solution:\n    def findKthLargest(self, nums, k):\n        heap = []\n        for x in nums:\n            heapq.heappush(heap, x)\n            if len(heap) > k:\n                heapq.heappop(heap)\n        return heap[0]", "python"], "task-scheduler": ["The most frequent task sets the frame: (maxCount − 1) gaps of size n+1, plus one slot per task tied for the max. The answer is at least the number of tasks.", "O(n) time, O(1) space", "from collections import Counter\n\nclass Solution:\n    def leastInterval(self, tasks, n):\n        counts = Counter(tasks).values()\n        mx = max(counts)\n        tied = sum(1 for c in counts if c == mx)\n        return max(len(tasks), (mx - 1) * (n + 1) + tied)", "python"], "daily-temperatures": ["Monotonic stack of indices waiting for a warmer day; pop and answer them when a warmer temperature arrives.", "O(n) time, O(n) space", "class Solution:\n    def dailyTemperatures(self, temperatures):\n        ans = [0] * len(temperatures)\n        stack = []\n        for i, t in enumerate(temperatures):\n            while stack and temperatures[stack[-1]] < t:\n                j = stack.pop()\n                ans[j] = i - j\n            stack.append(i)\n        return ans", "python"], "validate-ip-address": ["Check IPv4 (4 decimal parts 0–255, no leading zeros) and IPv6 (8 hex groups of 1–4 digits) separately.", "O(n) time, O(1) space", "class Solution:\n    def validIPAddress(self, queryIP):\n        def v4(s):\n            parts = s.split(\".\")\n            return len(parts) == 4 and all(\n                p.isdigit() and p.isascii() and str(int(p)) == p and int(p) <= 255 for p in parts)\n\n        def v6(s):\n            parts = s.split(\":\")\n            hexd = set(\"0123456789abcdefABCDEF\")\n            return len(parts) == 8 and all(1 <= len(p) <= 4 and set(p) <= hexd for p in parts)\n\n        if v4(queryIP):\n            return \"IPv4\"\n        if v6(queryIP):\n            return \"IPv6\"\n        return \"Neither\"", "python"], "maximum-depth-of-binary-tree": ["Depth is 1 + the deeper of the two subtrees (recursive DFS).", "O(n) time, O(h) space", "class Solution:\n    def maxDepth(self, root):\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))", "python"], "invert-binary-tree": ["Swap left and right at every node, recursively.", "O(n) time, O(h) space", "class Solution:\n    def invertTree(self, root):\n        if root:\n            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)\n        return root", "python"], "binary-tree-level-order-traversal": ["BFS with a queue, processing one level (the current queue length) at a time.", "O(n) time, O(n) space", "from collections import deque\n\nclass Solution:\n    def levelOrder(self, root):\n        if not root:\n            return []\n        out, q = [], deque([root])\n        while q:\n            level = []\n            for _ in range(len(q)):\n                node = q.popleft()\n                level.append(node.val)\n                if node.left: q.append(node.left)\n                if node.right: q.append(node.right)\n            out.append(level)\n        return out", "python"], "number-of-islands": ["Scan the grid; each unvisited \"1\" starts a new island, and an iterative DFS sinks the whole island.", "O(rows·cols) time and space", "class Solution:\n    def numIslands(self, grid):\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == \"1\":\n                    count += 1\n                    stack = [(r, c)]\n                    grid[r][c] = \"0\"\n                    while stack:\n                        i, j = stack.pop()\n                        for a, b in ((i+1, j), (i-1, j), (i, j+1), (i, j-1)):\n                            if 0 <= a < rows and 0 <= b < cols and grid[a][b] == \"1\":\n                                grid[a][b] = \"0\"\n                                stack.append((a, b))\n        return count", "python"], "course-schedule": ["Topological sort (Kahn): count prerequisites per course, start from those with none, and see if every course gets taken. A cycle leaves courses behind.", "O(V + E) time and space", "from collections import deque\n\nclass Solution:\n    def canFinish(self, numCourses, prerequisites):\n        graph = [[] for _ in range(numCourses)]\n        indeg = [0] * numCourses\n        for course, pre in prerequisites:\n            graph[pre].append(course)\n            indeg[course] += 1\n        q = deque(i for i in range(numCourses) if indeg[i] == 0)\n        taken = 0\n        while q:\n            c = q.popleft()\n            taken += 1\n            for nxt in graph[c]:\n                indeg[nxt] -= 1\n                if indeg[nxt] == 0:\n                    q.append(nxt)\n        return taken == numCourses", "python"], "climbing-stairs": ["Ways(n) = Ways(n−1) + Ways(n−2), a Fibonacci sequence; keep only the last two values.", "O(n) time, O(1) space", "class Solution:\n    def climbStairs(self, n):\n        a, b = 1, 1\n        for _ in range(n):\n            a, b = b, a + b\n        return a", "python"], "coin-change": ["Bottom-up DP: dp[x] = fewest coins for amount x = 1 + min(dp[x − coin]).", "O(amount × coins) time, O(amount) space", "class Solution:\n    def coinChange(self, coins, amount):\n        INF = amount + 1\n        dp = [0] + [INF] * amount\n        for x in range(1, amount + 1):\n            for c in coins:\n                if c <= x and dp[x - c] + 1 < dp[x]:\n                    dp[x] = dp[x - c] + 1\n        return dp[amount] if dp[amount] != INF else -1", "python"], "word-frequency": ["Split into one word per line, count with sort | uniq -c, sort by count descending, print \"word count\".", "O(n log n)", "tr -s ' \\n' '\\n' < words.txt | grep -v '^$' | sort | uniq -c | sort -rn | awk '{print $2, $1}'", "bash"], "tenth-line": ["Print only line 10; prints nothing if the file is shorter.", "O(n)", "sed -n '10p' file.txt\n# or: awk 'NR == 10' file.txt", "bash"], "valid-phone-numbers": ["Anchored extended regex for the two allowed formats.", "O(n)", "grep -E '^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$' file.txt", "bash"], "transpose-file": ["awk collects column i of every row into out[i], then prints each out[i] as a line.", "O(rows × cols)", "awk '{\n  for (i = 1; i <= NF; i++) out[i] = (NR == 1 ? $i : out[i] \" \" $i)\n}\nEND { for (i = 1; i <= NF; i++) print out[i] }' file.txt", "bash"], "combine-two-tables": ["LEFT JOIN keeps every person even without an address (address columns become NULL).", "", "SELECT p.firstName, p.lastName, a.city, a.state\nFROM Person p\nLEFT JOIN Address a ON a.personId = p.personId;", "sql"], "second-highest-salary": ["Distinct salaries, sorted descending, skip one. Wrapping in a SELECT returns NULL when there is no second salary.", "", "SELECT (\n  SELECT DISTINCT salary\n  FROM Employee\n  ORDER BY salary DESC\n  LIMIT 1 OFFSET 1\n) AS SecondHighestSalary;", "sql"], "duplicate-emails": ["Group by email and keep groups with more than one row.", "", "SELECT email AS Email\nFROM Person\nGROUP BY email\nHAVING COUNT(*) > 1;", "sql"], "customers-who-never-order": ["Anti-join: LEFT JOIN orders and keep customers with no matching order.", "", "SELECT c.name AS Customers\nFROM Customers c\nLEFT JOIN Orders o ON o.customerId = c.id\nWHERE o.id IS NULL;", "sql"], "department-highest-salary": ["Join departments, then keep rows whose salary equals that department's max (ties included).", "", "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON d.id = e.departmentId\nWHERE (e.departmentId, e.salary) IN (\n  SELECT departmentId, MAX(salary)\n  FROM Employee\n  GROUP BY departmentId\n);", "sql"], "rising-temperature": ["Self-join each day to the day before (DATEDIFF = 1) and keep warmer days.", "", "SELECT w.id\nFROM Weather w\nJOIN Weather y ON DATEDIFF(w.recordDate, y.recordDate) = 1\nWHERE w.temperature > y.temperature;", "sql"]};
GUIDES.push({id:'rgproject',cat:'Technical cheat sheets',title:'restore-guard: make it yours (8 milestones)',sum:'A guided project like a bootcamp work-ex module: rebuild understanding, then extend the code yourself, without AI.',body:`
<p>Interviewers will open your repo and ask "why did you do it this way?" and "how would you add X?". Do these in order, <b>without AI</b>, and commit each one under your name. Each milestone is also a strong interview story.</p>
<h3>Understand it (week 1–2)</h3>
<ol><li><b>Run it.</b> Clone it, run <code>make test</code> and <code>make demo</code>. Change one file in the demo dataset and watch the drill fail. Write down why.</li>
<li><b>Trace one drill.</b> Read <code>engine.py</code> top to bottom and draw the steps on paper: seed → backup → destroy → restore → verify → SLO check. Explain it out loud in 2 minutes.</li>
<li><b>Break a test on purpose.</b> Change the checksum comparison so it ignores missing files. Which test catches it? Undo it.</li></ol>
<h3>Extend it (week 3–6)</h3>
<ol start="4"><li><b>Add a <code>--dry-run</code> flag</b> to the CLI that validates config and prints the plan without touching data. Add a test. (Python, argparse, testing)</li>
<li><b>Add a Slack or webhook notifier</b> that posts the Markdown summary when a drill fails. Mock the HTTP call in tests. (APIs, mocking)</li>
<li><b>Add an S3 backend</b> using boto3, tested with moto (fake AWS). (AWS, the backend interface)</li>
<li><b>Ship a Grafana dashboard</b> (JSON in the repo) and a Prometheus alert rule on drill failures and RTO breaches. (Observability, SRE)</li>
<li><b>Release it properly.</b> Add a CHANGELOG, tag <code>v0.1.0</code> on github.com, have CI publish the container image with that version, and add a Helm chart for the CronJob. (Release engineering, Kubernetes)</li></ol>
<h3>Then talk about it</h3>
<ul><li>Pin the repo on your GitHub profile and link it on LinkedIn and your resume.</li>
<li>Prepare the 2-minute walkthrough: the problem (backups nobody restores), the design, one trade-off, one bug you hit, and what you'd add next.</li></ul>`});
