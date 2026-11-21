/* CodeTrail — lessons: every track, lesson and step */
const Lr=(h,body,code='')=>({t:'learn',h,body,code});
const M=(q,code,opts,a,why,w)=>({t:'mcq',q,code,opts,a,why,w});
const F=(q,code,toks,ans,why,w)=>({t:'fill',q,code,toks,ans,why,w});
const TRACKS={
py:{name:`Python`,lessons:[
{id:'p1',u:`Core concepts`,title:`Mutability & copies`,steps:[
 Lr(`Mutable vs immutable`,`Lists, dicts and sets change in place. ints, strings and tuples can't — "changing" them creates a new object. Interviewers love this.`,`a = [1, 2]
b = a          # same object, not a copy
b.append(3)
print(a)       # [1, 2, 3]`),
 M(`What does this print?`,`def add(x, items=[]):
    items.append(x)
    return items

add(1)
print(add(2))`,[`[2]`,`[1, 2]`,`[]`,`Error`],1,`Default arguments are created once, so the same list is reused across calls.`),
 F(`Fix the mutable-default bug`,`def add(x, items=___):
    if items is None:
        items = []`,[`None`,`[]`,`{}`],[`None`],`None is the safe sentinel for mutable defaults.`),
 M(`Which one fully copies a nested list?`,``,[`b = a`,`b = a[:]`,`b = copy.copy(a)`,`b = copy.deepcopy(a)`],3,`Slicing and copy.copy are shallow; inner lists stay shared.`),
 M(`a == b vs a is b?`,``,[`Same thing`,`== compares values, is compares identity`,`is compares values`,`is only works on ints`],1,`Use "is" only for None, True and False.`)]},
{id:'p2',u:`Core concepts`,title:`Comprehensions & generators`,steps:[
 Lr(`Comprehensions`,`A one-line way to build lists, dicts and sets, with an optional filter.`,`evens = [n * n for n in range(10) if n % 2 == 0]
by_id = {u["id"]: u for u in users}`),
 Lr(`Generators`,`A generator <code>yield</code>s one value at a time instead of building a whole list — ideal for huge log files.`,`def read_errors(path):
    with open(path) as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()`),
 M(`Main benefit of a generator over a list?`,``,[`Faster indexing`,`Low memory — values are made on demand`,`Can be sorted`,`Thread-safe`],1,`Lazy evaluation keeps only one item in memory at a time.`),
 F(`Make a generator, not a list`,`gen = ___x * x for x in nums___`,[`(`,`)`,`[`,`]`],[`(`,`)`],`Round brackets make a generator expression; square brackets build a list.`)]},
{id:'p3',u:`Core concepts`,title:`*args, **kwargs & decorators`,steps:[
 Lr(`*args and **kwargs`,`<code>*args</code> collects extra positional arguments into a tuple; <code>**kwargs</code> collects keyword arguments into a dict.`,`def log(msg, *args, **kwargs):
    print(msg, args, kwargs)

log("hi", 1, 2, level="info")
# hi (1, 2) {'level': 'info'}`),
 Lr(`Decorators`,`A decorator wraps a function to add behaviour — timing, retries, logging — without editing it.`,`import functools, time

def timer(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = fn(*args, **kwargs)
        print(fn.__name__, round(time.time() - start, 3))
        return result
    return wrapper`),
 M(`Why use functools.wraps?`,``,[`Speeds it up`,`Keeps the original name and docstring`,`Lets it take arguments`,`Required syntax`],1,`Without it, the decorated function reports itself as "wrapper".`),
 M(`Inside the function, kwargs is a…`,``,[`list`,`tuple`,`dict`,`set`],2,`**kwargs is a dict of keyword arguments.`)]},
{id:'p4',u:`Design`,title:`OOP essentials`,steps:[
 Lr(`Classes`,`<code>__init__</code> sets up an instance; <code>self</code> is the instance. <code>@classmethod</code> suits alternate constructors, <code>@staticmethod</code> plain helpers.`,`class Server:
    def __init__(self, host):
        self.host = host

    @classmethod
    def from_url(cls, url):
        return cls(url.split("//")[1])

    def __repr__(self):
        return f"Server({self.host!r})"`),
 M(`__str__ vs __repr__?`,``,[`No difference`,`__repr__ is for developers and debugging, __str__ for end users`,`__str__ is faster`,`__repr__ only works on lists`],1,`repr should be unambiguous; str should be readable.`),
 M(`What does super().__init__() do?`,``,[`Creates a new class`,`Runs the parent class's constructor`,`Deletes the object`,`Copies the object`],1,`The child reuses the parent's set-up instead of repeating it.`),
 F(`Let sq.area work without brackets`,`class Square:
    ___
    def area(self):
        return self.s ** 2`,[`@property`,`@staticmethod`,`@classmethod`],[`@property`],`@property exposes a method as a read-only attribute.`)]},
{id:'p5',u:`Design`,title:`Errors & context managers`,steps:[
 Lr(`try / except / else / finally`,`<code>else</code> runs only if nothing failed; <code>finally</code> always runs — use it for clean-up.`,`try:
    data = json.loads(text)
except json.JSONDecodeError as e:
    log.error("bad json: %s", e)
else:
    process(data)
finally:
    conn.close()`),
 M(`Why use "with open(...)"?`,``,[`It's faster`,`The file is closed even if an error happens`,`It reads the whole file`,`Required in Python 3`],1,`Context managers guarantee clean-up via __enter__ and __exit__.`),
 M(`Why avoid a bare "except:"?`,``,[`Syntax error`,`It swallows everything, even Ctrl+C, and hides real bugs`,`It's slow`,`It only catches ValueError`],1,`Catch specific exceptions, or at most Exception.`)]},
{id:'p6',u:`Design`,title:`Performance & the GIL`,steps:[
 Lr(`Big-O you must know`,`dict and set lookups are O(1) on average; <code>in</code> on a list is O(n); sorting is O(n log n).`,`# slow: scans the list every time
if user in user_list: ...
# fast: hash lookup
if user in user_set: ...`),
 M(`What does the GIL limit?`,``,[`Memory use`,`Only one thread runs Python bytecode at a time`,`Number of processes`,`File I/O`],1,`Threads still help with I/O-bound work.`),
 M(`Run 8 CPU-heavy tasks in parallel with…`,``,[`threading`,`asyncio`,`multiprocessing`,`a for loop`],2,`Each process has its own interpreter and GIL.`),
 M(`Best fit for 500 concurrent HTTP calls?`,``,[`multiprocessing`,`asyncio or a thread pool`,`recursion`,`time.sleep`],1,`The work is I/O-bound: waiting on the network, not the CPU.`)]},
{id:'p7',u:`Design`,title:`FastAPI essentials`,steps:[
 Lr(`Build an API fast`,`FastAPI uses type hints to validate requests and generates OpenAPI docs for free. Pydantic models describe the data.`,`from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items", status_code=201)
def create(item: Item):
    return item

@app.get("/items/{item_id}")
def read(item_id: int):
    if item_id not in DB:
        raise HTTPException(status_code=404, detail="Not found")
    return DB[item_id]`),
 M(`A client posts {"name": "pen", "price": "abc"}. What happens?`,``,[`It's saved as text`,`FastAPI returns 422 with a validation error`,`The server crashes with 500`,`price becomes 0`],1,`Pydantic validates the body against the model before your code runs.`),
 M(`How do you give every endpoint a DB session that gets closed?`,``,[`A global variable`,`A dependency with Depends()`,`Middleware only`,`An environment variable`],1,`A yield-based dependency opens the session, and closes it after the response.`),
 M(`async def or plain def for an endpoint calling a blocking library?`,``,[`async def, always`,`Plain def — FastAPI runs it in a thread pool`,`Neither works`,`async def with time.sleep`],1,`A blocking call inside async def freezes the event loop for every request.`)]}
]},
ops:{name:`DevOps`,lessons:[
{id:'o1',u:`Linux & networking`,title:`Linux troubleshooting`,steps:[
 Lr(`"The server is slow" — where to start`,`Work through CPU and load, memory, disk, then logs. Say this order out loud in interviews.`,`top / htop          # CPU, load, processes
free -h             # memory
df -h               # disk space
du -sh /var/*       # what's big
journalctl -u nginx --since "1 hour ago"`),
 M(`Disk is 100% full but you deleted the big log. Why is space not freed?`,``,[`Cache delay`,`A process still holds the deleted file open`,`The disk is broken`,`You must always reboot`],1,`Find it with lsof | grep deleted, then restart or signal that process.`),
 F(`Find what is listening on port 8080`,`sudo ___ -tulpn | grep 8080`,[`ss`,`ls`,`ps`,`df`],[`ss`],`ss (or older netstat) lists listening sockets.`),
 M(`Load average 4.0 on a 4-core box means…`,``,[`Badly overloaded`,`CPUs roughly fully used`,`Idle`,`Out of memory`],1,`Load near the core count means the CPUs are fully busy.`)]},
{id:'o2',u:`Linux & networking`,title:`Networking basics`,steps:[
 Lr(`What happens when you open a URL`,`DNS lookup → TCP handshake → TLS handshake → HTTP request → load balancer → app → response.`,`dig example.com
curl -v https://example.com   # shows TLS and HTTP
traceroute example.com`),
 M(`A 502 from a load balancer usually means…`,``,[`Bad client request`,`The backend is down or returned an invalid response`,`Page not found`,`Not logged in`],1,`502 Bad Gateway: the proxy got no good answer upstream.`),
 M(`401 vs 403?`,``,[`Same`,`401 not authenticated; 403 authenticated but not allowed`,`401 is a server error`,`403 means not found`],1,`401: who are you? 403: I know you, still no.`),
 M(`TCP vs UDP?`,``,[`Same`,`TCP is reliable and ordered; UDP is faster with no delivery guarantee`,`UDP is encrypted`,`TCP is only for DNS`],1,`DNS queries and video streams often use UDP.`)]},
{id:'o3',u:`Git & containers`,title:`Git in teams`,steps:[
 Lr(`Merge vs rebase`,`Merge keeps history as it happened, with a merge commit. Rebase replays your commits on top for a straight line. Never rebase a shared branch.`,`git fetch origin
git rebase origin/main
# fix conflicts, then
git rebase --continue`),
 M(`Committed to the wrong branch (not pushed). Undo, keep the changes?`,``,[`git reset --hard HEAD~1`,`git reset --soft HEAD~1`,`git revert HEAD`,`git rm`],1,`--soft moves HEAD back and keeps changes staged.`),
 M(`Safe way to undo a commit already pushed to main?`,``,[`git reset --hard`,`git revert <sha>`,`git push --force`,`Delete the repo`],1,`revert adds a new commit that undoes it, so shared history stays intact.`),
 F(`Copy one commit from another branch`,`git ___ a1b2c3d`,[`cherry-pick`,`rebase`,`stash`,`merge`],[`cherry-pick`],`cherry-pick applies a single commit to your branch.`)]},
{id:'o4',u:`Git & containers`,title:`Docker deep dive`,steps:[
 Lr(`Smaller, faster images`,`Slim bases, rarely-changed layers first, and multi-stage builds.`,`FROM python:3.12-slim AS build
COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
COPY --from=build /install /usr/local
COPY . /app
CMD ["python", "/app/main.py"]`),
 M(`Why COPY requirements.txt before the code?`,``,[`Required order`,`The dependency layer stays cached when only code changes`,`Smaller image`,`Security`],1,`Docker reuses cached layers until something above them changes.`),
 M(`CMD vs ENTRYPOINT?`,``,[`Identical`,`ENTRYPOINT is the fixed command; CMD gives default arguments you can override`,`CMD runs at build time`,`ENTRYPOINT is deprecated`],1,`Arguments to docker run replace CMD, not ENTRYPOINT.`),
 F(`Open a shell in the running container "web"`,`docker ___ -it web sh`,[`exec`,`run`,`attach`,`enter`],[`exec`],`exec starts a new process inside an existing container.`)]},
{id:'o5',u:`Git & containers`,title:`Kubernetes`,steps:[
 Lr(`Core objects`,`Pod runs containers. Deployment keeps N pods alive. Service gives a stable name and load-balances. ConfigMap and Secret hold config. Ingress routes HTTP.`,`kubectl get pods -o wide
kubectl describe pod web-7d9f
kubectl logs web-7d9f --previous
kubectl rollout undo deploy/web`),
 M(`A pod is in CrashLoopBackOff. First step?`,``,[`Delete the cluster`,`kubectl logs --previous and kubectl describe pod`,`Add nodes`,`Change the Service`],1,`Crashed container logs and pod events show why it keeps dying.`),
 M(`Liveness vs readiness probe?`,``,[`Same`,`Liveness restarts a stuck container; readiness holds traffic until it's ready`,`Readiness restarts pods`,`Liveness is for Services`],1,`Fail readiness: no traffic. Fail liveness: restart.`),
 F(`Roll back a bad release`,`kubectl rollout ___ deploy/web`,[`undo`,`back`,`revert`,`reset`],[`undo`],`rollout undo returns to the previous ReplicaSet.`)]},
{id:'o6',u:`Delivery & reliability`,title:`CI/CD & Terraform`,steps:[
 Lr(`Pipeline stages`,`Typical flow: lint → unit tests → build image → security scan → push → deploy to staging → smoke tests → prod via canary or approval.`),
 Lr(`Terraform workflow`,`Describe infrastructure as code, review the plan, then apply. State records what exists.`,`terraform init
terraform plan -out tf.plan
terraform apply tf.plan
# keep state remote with locking (e.g. S3 + DynamoDB)`),
 M(`Blue-green vs canary?`,``,[`Same`,`Blue-green switches all traffic to a new copy; canary moves a small share first`,`Canary needs two clusters`,`Blue-green is only for databases`],1,`Canary limits blast radius; blue-green gives instant rollback.`),
 M(`Why remote Terraform state with locking?`,``,[`Faster plans`,`One shared truth, and two applies can't clash`,`AWS requires it`,`Smaller files`],1,`State on laptops leads to drift and conflicts.`),
 M(`Where do pipeline secrets belong?`,``,[`In the repo`,`CI secret store or a vault`,`Dockerfile`,`README`],1,`Never commit secrets; inject them at run time.`)]},
{id:'o7',u:`Delivery & reliability`,title:`SRE & monitoring`,steps:[
 Lr(`SLI, SLO, error budget`,`SLI is what you measure (share of successful requests). SLO is the target (99.9%). The error budget (0.1%) decides when to slow releases and fix reliability.`),
 M(`99.9% monthly availability allows about…`,``,[`4 minutes down`,`43 minutes down`,`7 hours down`,`1 day down`],1,`0.1% of ~43,200 minutes ≈ 43 minutes.`),
 M(`The four golden signals are…`,``,[`CPU, RAM, disk, network`,`Latency, traffic, errors, saturation`,`Logs, metrics, traces, alerts`,`Build, test, deploy, monitor`],1,`From Google's SRE book — know them by heart.`),
 M(`A blameless postmortem is for…`,``,[`Finding who to blame`,`Learning what failed in the system and fixing causes`,`Legal records`,`Customer apologies`],1,`Focus on systems and process, with owned action items.`)]},
{id:'o8',u:`Delivery & reliability`,title:`GitOps & Argo CD`,steps:[
 Lr(`GitOps in one line`,`Git holds the desired state; an agent in the cluster (Argo CD or Flux) pulls it and keeps the cluster matching. Deploy = merge a PR. Roll back = revert it.`,`apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: web
spec:
  source:
    repoURL: https://github.com/acme/deploy
    path: apps/web
  destination:
    namespace: web
  syncPolicy:
    automated:
      prune: true
      selfHeal: true`),
 M(`Someone runs kubectl edit in prod. With selfHeal on, Argo CD…`,``,[`Keeps the manual change`,`Puts the cluster back to what Git says`,`Deletes the app`,`Opens a pull request`],1,`Drift from Git is corrected automatically, so Git stays the single source of truth.`),
 M(`Main advantage of pull-based GitOps over CI running kubectl apply?`,``,[`Faster builds`,`CI needs no cluster credentials, and drift is caught continuously`,`No YAML needed`,`Works without Git`],1,`The agent pulls from inside the cluster, which shrinks the attack surface.`),
 F(`Delete resources that were removed from Git`,`syncPolicy:
  automated:
    ___: true`,[`prune`,`delete`,`clean`,`purge`],[`prune`],`prune removes cluster resources that no longer exist in Git.`)]},
{id:'o9',u:`Delivery & reliability`,title:`Observability stack`,steps:[
 Lr(`Metrics, logs, traces`,`Metrics (Prometheus) say something is wrong; logs (Loki, Splunk, ELK) say what; traces (OpenTelemetry, Jaeger) say where in the request path.`,`# PromQL: share of 5xx responses over 5 minutes
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))`),
 M(`Why wrap a counter in rate() in PromQL?`,``,[`Counters reset daily`,`Counters only go up; rate() turns them into change per second`,`Required syntax`,`To convert to a percentage`],1,`A raw counter value is rarely useful on its own.`),
 M(`What should page a human at night?`,``,[`CPU above 80%`,`A user-facing symptom, like an error-rate SLO burning fast`,`Every warning log line`,`Disk at 50%`],1,`Page on symptoms that hurt users; send causes to dashboards or tickets.`),
 M(`What does OpenTelemetry give you?`,``,[`A database`,`Vendor-neutral APIs and SDKs for traces, metrics and logs`,`A CI tool`,`A Kubernetes distribution`],1,`Instrument once, then send the data to whichever backend you use.`)]},
{id:'o10',u:`Linux & networking`,title:`Bash one-liners`,steps:[
 Lr(`Text-processing toolkit`,`grep finds lines, awk picks columns, sort and uniq count, cut slices, sed edits streams. Chained with pipes, they answer most log questions in one line.`,`# top 5 client IPs in an nginx access log
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -5

# count 5xx responses (status is field 9)
awk '$9 ~ /^5/' access.log | wc -l`),
 F(`Count how often each line appears, most common first`,`sort app.log | ___ -c | sort -rn`,[`uniq`,`wc`,`cut`,`tr`],[`uniq`],`uniq -c counts adjacent duplicates — that's why you sort first.`),
 F(`Print the 2nd column of a CSV`,`___ -F, '{print $2}' users.csv`,[`awk`,`grep`,`sed`,`cut`],[`awk`],`-F sets the field separator; cut -d, -f2 also works.`),
 M(`Find files over 100 MB under /var?`,``,[`ls -lh /var | grep 100M`,`find /var -type f -size +100M`,`du /var > 100M`,`grep -r 100M /var`],1,`find filters by type, size and age (-mtime +7) and can -exec on results.`),
 F(`Replace http: with https: in place`,`___ -i 's/http:/https:/g' config.yaml`,[`sed`,`awk`,`tr`,`grep`],[`sed`],`sed -i edits in place; s/old/new/g replaces every match on each line.`)]},
{id:'o11',u:`Linux & networking`,title:`Shell scripting essentials`,steps:[
 Lr(`Safer scripts`,`Start with set -euo pipefail: exit on errors, fail on unset variables, and catch failures inside pipes. Quote your variables. Check exit codes with $?.`,`#!/usr/bin/env bash
set -euo pipefail

for host in web01 web02 web03; do
  if ! ping -c1 -W2 "$host" > /dev/null; then
    echo "$host is down" >&2
  fi
done`),
 M(`What does $? hold?`,``,[`The script name`,`The exit code of the last command (0 = success)`,`The process ID`,`The number of arguments`],1,`$$ is the PID, $# the argument count, $0 the script name.`),
 M(`Why quote "$file" in scripts?`,``,[`Style only`,`Unquoted, a name with spaces splits into several arguments`,`It runs faster`,`Bash requires it`],1,`Quoting prevents word splitting and glob surprises.`),
 F(`Run backup.sh every day at 2:30 am (cron)`,`___ 2 * * * /opt/backup.sh`,[`30`,`2`,`*`,`0`],[`30`],`Cron fields: minute, hour, day of month, month, day of week.`),
 M(`What does 2>&1 mean?`,``,[`Run twice`,`Send stderr to the same place as stdout`,`Append to a file named 2`,`Run in the background`],1,`In cron, >> job.log 2>&1 keeps errors in the log too.`)]},
{id:'o12',u:`Kubernetes for CKA`,title:`RBAC & NetworkPolicy`,ref:[[`Kubernetes — RBAC`,`https://kubernetes.io/docs/reference/access-authn-authz/rbac/`],[`Kubernetes — Network Policies`,`https://kubernetes.io/docs/concepts/services-networking/network-policies/`],[`CNCF exam curriculum (CKA)`,`https://github.com/cncf/curriculum`]],steps:[
 Lr(`Who can do what, who can talk to whom`,`A <b>Role</b> lists verbs on resources in one namespace; a <b>ClusterRole</b> is cluster-wide. A <b>RoleBinding</b> grants a role to a user, group or service account. NetworkPolicies select pods by label and allow ingress/egress; once a pod is selected, anything not allowed is denied. Interview tip from your career report: speak about RBAC generally and don't describe your patent application's approach.`,`kubectl create role pod-reader --verb=get,list,watch --resource=pods -n app
kubectl create rolebinding ci-reads --role=pod-reader --serviceaccount=app:ci -n app
kubectl auth can-i list pods -n app --as=system:serviceaccount:app:ci   # yes

# default-deny all ingress in a namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: {name: default-deny, namespace: app}
spec: {podSelector: {}, policyTypes: [Ingress]}`),
 M(`Quickest way to check whether a service account can delete deployments?`,``,[`Read every YAML`,`kubectl auth can-i delete deployments --as=system:serviceaccount:ns:name`,`Restart the cluster`,`kubectl get roles`],1,`auth can-i evaluates RBAC for you.`,`Very common in the CKA exam and in real debugging of "forbidden" errors.`),
 M(`A default-deny ingress policy is applied. Pods still talk freely. Why?`,``,[`Policies need a restart`,`The cluster's network plugin (CNI) doesn't enforce NetworkPolicy`,`RBAC overrides it`,`Pods ignore labels`],1,`NetworkPolicy is enforced by the CNI (Calico, Cilium…); some don't support it.`,`Always check which CNI you run before relying on policies.`),
 F(`Grant a Role inside one namespace`,`kubectl create ___ dev-edit --role=editor --user=asha -n dev`,[`rolebinding`,`clusterrole`,`role`,`binding`],[`rolebinding`],`RoleBinding attaches a Role to a subject in one namespace.`)]},
{id:'o13',u:`Kubernetes for CKA`,title:`Scheduling & troubleshooting`,ref:[[`Kubernetes — Taints and tolerations`,`https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/`],[`Kubernetes — Troubleshooting`,`https://kubernetes.io/docs/tasks/debug/`]],steps:[
 Lr(`Why is my pod Pending or crashing?`,`<b>Pending</b>: the scheduler can't place it — not enough CPU/memory requests free, a taint without toleration, node affinity mismatch, or an unbound PVC. <b>CrashLoopBackOff</b>: it starts and dies — read logs of the previous container and the events. <b>ImagePullBackOff</b>: wrong image name/tag or registry credentials.`,`kubectl describe pod web-7d9f        # Events at the bottom say why
kubectl logs web-7d9f --previous      # logs from the crashed container
kubectl get events -n app --sort-by=.lastTimestamp
kubectl top nodes                     # needs metrics-server
kubectl describe node node-2 | grep -A5 Taints`),
 M(`Pod Pending with "0/3 nodes are available: 3 Insufficient memory". Fix?`,``,[`Restart kubelet`,`Lower the pod's memory request or add capacity`,`Delete the namespace`,`Change the image`],1,`The scheduler places pods by requests, not actual usage.`,`Also check for requests set far higher than the app needs.`),
 M(`Get logs from the container that crashed before the current restart?`,``,[`kubectl logs pod`,`kubectl logs pod --previous`,`kubectl describe logs`,`docker logs`],1,`--previous (-p) shows the last terminated container's logs.`,`One of the readiness questions in your career report.`),
 M(`Drain a node for maintenance safely?`,``,[`kubectl delete node`,`kubectl cordon then kubectl drain --ignore-daemonsets`,`Reboot it`,`Scale everything to zero`],1,`Cordon stops new pods; drain evicts existing ones respecting PodDisruptionBudgets.`,`Afterwards: kubectl uncordon.`)]},
{id:'o14',u:`Kubernetes for CKA`,title:`etcd backup & upgrades`,ref:[[`Kubernetes — Operating etcd (backup & restore)`,`https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/`],[`Kubernetes — Upgrading kubeadm clusters`,`https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/`]],steps:[
 Lr(`Protect the cluster's brain`,`etcd holds all cluster state, so back it up like any critical database — your storage background is a real advantage here. Take a snapshot with etcdctl using the cluster's TLS certificates; restore it to a new data directory and point etcd at it. Upgrade kubeadm clusters one minor version at a time: control plane first, then each node (drain, upgrade kubelet, uncordon).`,`ETCDCTL_API=3 etcdctl snapshot save /backup/etcd.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key
etcdutl snapshot restore /backup/etcd.db --data-dir /var/lib/etcd-restored`),
 M(`What does an etcd snapshot protect?`,``,[`Application data in PVCs`,`Cluster state: objects like Deployments, Services, Secrets, ConfigMaps`,`Container images`,`Node operating systems`],1,`It's the API objects, not volume data.`,`Volume data needs its own backups (CSI snapshots, Velero) — the restore-guard project idea from your report.`),
 M(`Upgrading from 1.30 to 1.32 with kubeadm?`,``,[`Jump straight to 1.32`,`Go 1.30 → 1.31 → 1.32, control plane first each time`,`Upgrade nodes first`,`Reinstall the cluster`],1,`kubeadm supports one minor version per upgrade.`,`Read the release notes for removed APIs before each step.`)]},
{id:'o15',u:`Delivery & reliability`,title:`Terraform modules & remote state`,ref:[[`Terraform — Modules`,`https://developer.hashicorp.com/terraform/language/modules`],[`Terraform — S3 backend`,`https://developer.hashicorp.com/terraform/language/backend/s3`]],steps:[
 Lr(`Reusable, shared, locked`,`A <b>module</b> is a folder of Terraform you call with inputs and outputs, so every environment uses the same tested code. Teams keep <b>state</b> in a remote backend (e.g. S3 with versioning) with <b>locking</b>, so two applies can't corrupt it. Newer Terraform versions can lock with S3 itself (use_lockfile); older setups use a DynamoDB table. Never hand-edit state without a backup; use import and state mv/moved blocks instead.`,`terraform {
  backend "s3" {
    bucket       = "acme-tf-state"
    key          = "prod/network.tfstate"
    region       = "ap-south-1"
    use_lockfile = true      # S3-native locking (newer Terraform)
    encrypt      = true
  }
}

module "vpc" {
  source = "./modules/vpc"
  cidr   = "10.0.0.0/16"
}`),
 M(`State got corrupted after two people applied at once. Recovery?`,``,[`Delete state and re-apply`,`Restore the previous state version from the versioned bucket, fix locking, then run plan to check drift`,`Edit the JSON by hand`,`Ignore it`],1,`Versioned remote state is your backup; locking prevents a repeat.`,`From your report's mock questions: remote state with locking, restore from versioning, import for drift.`),
 M(`Why wrap infrastructure in modules?`,``,[`Faster applies`,`Reuse the same reviewed code across environments and teams`,`Required by AWS`,`To skip plan`],1,`Modules are the unit of reuse and review.`,`Version them (git tags or a registry) so prod doesn't change when someone edits the module.`)]}


]},
auto:{name:`Automation`,lessons:[
{id:'a1',u:`Testing with Python`,title:`pytest essentials`,steps:[
 Lr(`Tests and fixtures`,`Test functions start with <code>test_</code>. Fixtures provide set-up and clean-up; code after <code>yield</code> is the teardown.`,`import pytest

@pytest.fixture
def client():
    c = make_client()
    yield c
    c.close()

def test_health(client):
    assert client.get("/health").status_code == 200`),
 F(`Run one test with several inputs`,`@pytest.mark.___("n,expected", [(2, 4), (3, 9)])
def test_square(n, expected):
    assert n * n == expected`,[`parametrize`,`repeat`,`fixture`,`params`],[`parametrize`],`parametrize runs the test once per tuple.`),
 M(`Which fixture scope runs once per test run?`,``,[`function`,`class`,`module`,`session`],3,`Session scope suits expensive set-up like a database container.`),
 M(`Where do shared fixtures live?`,``,[`setup.py`,`conftest.py`,`__init__.py`,`pytest.ini`],1,`pytest discovers conftest.py automatically.`)]},
{id:'a2',u:`Testing with Python`,title:`Mocking`,steps:[
 Lr(`Replace slow or external parts`,`<code>unittest.mock</code> swaps real calls for fakes, so tests are fast and don't depend on the network.`,`from unittest.mock import patch

@patch("app.service.requests.get")
def test_fetch(mock_get):
    mock_get.return_value.json.return_value = {"ok": True}
    assert fetch() == {"ok": True}`),
 M(`Where should you patch?`,``,[`Where the object is defined`,`Where it is looked up and used`,`Anywhere`,`Only in conftest`],1,`Patch "app.service.requests", not "requests", when app.service imports it.`),
 M(`Assert a mock got called with certain arguments?`,``,[`mock.called_with()`,`mock.assert_called_once_with(...)`,`assert mock`,`mock.verify()`],1,`assert_called_once_with fails loudly if the arguments differ.`),
 M(`Stub vs mock?`,``,[`Same`,`A stub returns canned data; a mock also records calls you can assert on`,`Mocks are slower`,`Stubs are for UI only`],1,`A fake is a third kind: a lightweight working version, like an in-memory DB.`)]},
{id:'a3',u:`Testing with Python`,title:`API testing`,steps:[
 Lr(`Test a REST API with requests`,`Check status, schema, key values and error cases. Always set a timeout.`,`import requests

r = requests.post(f"{BASE}/users", json={"name": "a"}, timeout=10)
assert r.status_code == 201
assert r.json()["name"] == "a"`),
 M(`Status code for "created"?`,``,[`200`,`201`,`204`,`302`],1,`201 Created; 204 No Content often follows a delete.`),
 M(`Why always pass timeout= to requests?`,``,[`Faster`,`Without it a hung server can block the test forever`,`Required argument`,`Turns on retries`],1,`requests has no default timeout.`),
 F(`Send a JSON body`,`requests.post(url, ___={"id": 1}, timeout=10)`,[`json`,`data`,`body`,`params`],[`json`],`json= serialises the dict and sets Content-Type.`)]},
{id:'a4',u:`Frameworks`,title:`UI automation`,steps:[
 Lr(`Reliable Selenium and Playwright`,`Use explicit waits, stable locators (id, data-testid) and the Page Object Model.`,`from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "login"))
).click()`),
 M(`Why avoid time.sleep() in UI tests?`,``,[`Deprecated`,`Slow and still flaky — explicit waits only wait as long as needed`,`Crashes the browser`,`Breaks headless mode`],1,`Explicit waits poll for a condition.`),
 M(`The Page Object Model is…`,``,[`A database pattern`,`A class per page wrapping its locators and actions`,`A browser driver`,`A CSS framework`],1,`Tests read like steps, and a locator change is fixed in one place.`)]},
{id:'a5',u:`Frameworks`,title:`Frameworks & flaky tests`,steps:[
 Lr(`Describe your framework`,`Answer in this order: stack → layers (config, utilities, API or page objects, tests, data) → reporting → CI trigger → parallel runs → one result with a number, e.g. regression cut from days to hours.`),
 M(`Passes locally, fails in CI 1 run in 5. Likely causes?`,``,[`Bad luck`,`Timing, shared state, test order or environment differences`,`Python version only`,`Too many tests`],1,`Isolate state, remove sleeps, pin data, and run in random order to reproduce.`),
 M(`The test pyramid says most tests should be…`,``,[`UI tests`,`Unit tests`,`Manual tests`,`Load tests`],1,`Many fast unit tests, fewer integration, fewest end-to-end.`),
 F(`Run pytest in parallel with pytest-xdist`,`pytest ___ auto`,[`-n`,`-p`,`-x`,`-k`],[`-n`],`-n auto uses one worker per CPU core.`)]},
{id:'a6',u:`Frameworks`,title:`Scripting automation`,steps:[
 Lr(`Run shell commands from Python`,`<code>subprocess.run</code> with a list of arguments (no shell=True) is the safe default.`,`import subprocess

r = subprocess.run(["df", "-h"], capture_output=True, text=True, check=True)
print(r.stdout)`),
 M(`Why avoid shell=True with user input?`,``,[`Slower`,`Shell injection risk`,`Doesn't work on Linux`,`No output`],1,`Input like "; rm -rf /" would run as a command.`),
 F(`Raise an error if the command fails`,`subprocess.run(cmd, ___=True)`,[`check`,`strict`,`raise`,`fail`],[`check`],`check=True raises CalledProcessError on a non-zero exit.`),
 M(`Best way to parse command-line flags?`,``,[`Slicing sys.argv`,`argparse`,`input()`,`os.environ`],1,`argparse gives help text, types and validation for free.`)]},
{id:'a7',u:`Frameworks`,title:`Data & SQL validation`,steps:[
 Lr(`Test data pipelines`,`Data-heavy QA roles check that rows arrive complete and correct: source-to-target counts, nulls, duplicates and values — usually SQL inside pytest.`,`def test_no_duplicate_orders(db):
    rows = db.execute("""
        SELECT order_id, COUNT(*) FROM orders
        GROUP BY order_id HAVING COUNT(*) > 1
    """).fetchall()
    assert rows == [], f"duplicates: {rows}"`),
 M(`Which SQL finds duplicate keys?`,``,[`SELECT DISTINCT`,`GROUP BY key HAVING COUNT(*) > 1`,`ORDER BY key`,`WHERE key IS NULL`],1,`HAVING filters groups after they are counted.`),
 F(`Find rows in a that are missing from b`,`SELECT a.id FROM a
___ JOIN b ON a.id = b.id
WHERE b.id IS NULL`,[`LEFT`,`INNER`,`CROSS`,`RIGHT`],[`LEFT`],`LEFT JOIN keeps every row of a; unmatched rows have NULL on b's side.`),
 M(`Fastest first check after a load job?`,``,[`Eyeball some rows`,`Compare source and target row counts`,`Re-run the job`,`Check CPU`],1,`Count reconciliation catches dropped or doubled loads in seconds.`)]},
{id:'a8',u:`Frameworks`,title:`Security automation`,steps:[
 Lr(`Automating security work`,`Security automation (SOAR) roles use Python to pull alerts from APIs, enrich them and act — block an IP, open a ticket, isolate a host.`,`import os, requests

TOKEN = os.environ["SIEM_TOKEN"]   # never hard-code secrets
r = requests.get(f"{SIEM}/alerts", params={"severity": "high"},
                 headers={"Authorization": f"Bearer {TOKEN}"}, timeout=15)
r.raise_for_status()
for alert in r.json()["items"]:
    enrich_and_ticket(alert)`),
 M(`An API answers 429 Too Many Requests. Best response?`,``,[`Retry at once in a tight loop`,`Back off and retry, honouring the Retry-After header`,`Give up for good`,`Switch to HTTP`],1,`Exponential backoff with jitter avoids hammering the API.`),
 M(`Where should the API token come from?`,``,[`Hard-coded in the script`,`An environment variable or a secrets manager`,`A code comment`,`The README`],1,`Secrets in code end up in Git history forever.`),
 M(`What does r.raise_for_status() do?`,``,[`Prints the status`,`Raises an exception on 4xx and 5xx responses`,`Retries the request`,`Returns True`],1,`It stops a script from quietly processing an error page.`)]}
]},
con:{name:`Concepts`,lessons:[
{id:'k1',u:`How things work: Python`,title:`How Python runs your code`,steps:[
 Lr(`Source → bytecode → interpreter`,`CPython compiles your .py file to bytecode, then a virtual machine executes it one instruction at a time. Everything — ints, functions, classes — is an object on the heap, and variables are just names pointing at objects.`,`import dis
def add(a, b):
    return a + b
dis.dis(add)   # shows LOAD_FAST, BINARY_OP, RETURN_VALUE`),
 Lr(`Memory: reference counting + GC`,`Each object counts how many names point to it. When the count hits 0, it's freed immediately. A separate cyclic garbage collector cleans up objects that only reference each other.`,`import sys
x = []
print(sys.getrefcount(x))  # count (+1 for the call itself)`),
 M(`When is an object normally freed in CPython?`,``,[`When the program exits`,`When its reference count drops to 0`,`Every 10 seconds`,`Only when gc.collect() runs`],1,`Reference counting frees most objects instantly; the cyclic GC handles reference cycles.`),
 M(`a = [1]; b = a. How many list objects exist?`,``,[`Two`,`One, with two names`,`None`,`Depends on the OS`],1,`Assignment never copies — it binds another name to the same object.`)]},
{id:'k2',u:`How things work: Python`,title:`Hashing: dicts, sets, HashMaps`,steps:[
 Lr(`How a hash map works`,`A key is passed through a hash function to a number, which picks a bucket in an array. Lookup jumps straight to that bucket — O(1) on average. Two keys landing in the same slot is a collision; Python resolves it by probing the next slots.`,`d = {}
d["web01"] = 443      # hash("web01") → slot → store
d["web01"]            # same hash → same slot → found`),
 M(`Why must dict keys be immutable (hashable)?`,``,[`To save memory`,`If a key changed, its hash would change and it could never be found again`,`Python style rule only`,`For sorting`],1,`That's why lists can't be keys but tuples of immutables can.`),
 M(`Worst-case lookup time in a hash map?`,``,[`O(1)`,`O(log n)`,`O(n), when many keys collide`,`O(n²)`],2,`Average O(1); a terrible hash puts everything in one chain.`),
 M(`Why is "x in my_set" faster than "x in my_list"?`,``,[`Sets are sorted`,`Sets hash x and jump to one slot; lists scan every item`,`Lists are on disk`,`It isn't faster`],1,`O(1) average vs O(n).`)]},
{id:'k3',u:`How things work: Python`,title:`Concurrency models`,steps:[
 Lr(`Process, thread, coroutine`,`A process has its own memory. Threads share one process's memory, so they need locks. Coroutines (asyncio) take turns on one thread, switching only at await — cheap for thousands of waiting network calls.`,`import asyncio
async def fetch(i):
    await asyncio.sleep(1)       # yields control while waiting
    return i
async def main():
    print(await asyncio.gather(*(fetch(i) for i in range(100))))
asyncio.run(main())              # ~1 second, not 100`),
 M(`What is a race condition?`,``,[`Two tests running in parallel`,`The result depends on the timing of threads touching shared data`,`A slow network`,`A deadlock`],1,`Fix it with a lock, a queue, or by not sharing state.`),
 M(`What is a deadlock?`,``,[`A crashed thread`,`Two workers each wait for a lock the other holds, forever`,`High CPU`,`A full queue`],1,`Always acquire locks in the same order to avoid it.`),
 M(`Inside an async function you call time.sleep(5). What happens?`,``,[`Only that coroutine pauses`,`The whole event loop blocks for 5 seconds`,`It raises an error`,`It's converted to await`],1,`Use await asyncio.sleep() — blocking calls freeze every coroutine.`)]},
{id:'k4',u:`How things work: Infrastructure`,title:`How containers really work`,steps:[
 Lr(`A container is just a process`,`Linux namespaces give a process its own view of PIDs, network, mounts and hostname (isolation). cgroups limit how much CPU and memory it can use. The image is a stack of read-only layers with a thin writable layer on top.`,`docker run --memory 256m --cpus 0.5 nginx
# --memory / --cpus become cgroup limits
docker exec web ps aux   # sees only its own processes (PID namespace)`),
 M(`What enforces a container's memory limit?`,``,[`Namespaces`,`cgroups`,`The Dockerfile`,`The image registry`],1,`Namespaces isolate what a process can see; cgroups limit what it can use.`),
 M(`A container exceeds its memory limit. Typical result?`,``,[`It slows down forever`,`The kernel's OOM killer stops it (exit code 137)`,`It gets more memory`,`Docker restarts the host`],1,`137 = 128 + signal 9 (SIGKILL). In Kubernetes you'll see OOMKilled.`),
 M(`Why are containers lighter than VMs?`,``,[`They use less disk only`,`They share the host kernel instead of booting a full guest OS`,`They can't use the network`,`They run in the browser`],1,`No guest kernel, so start-up is seconds and overhead is small.`)]},
{id:'k5',u:`How things work: Infrastructure`,title:`How Kubernetes thinks`,steps:[
 Lr(`Desired state and control loops`,`You declare desired state (3 replicas). Controllers loop forever: observe actual state, compare, act to close the gap. That reconciliation loop is why Kubernetes "self-heals".`,`API server   → the front door; everything talks to it
etcd         → key-value store holding all cluster state
scheduler    → picks a node for each new pod
controller-manager → runs the reconcile loops
kubelet      → on each node, starts and watches pods
kube-proxy   → programs Service routing rules on each node`),
 M(`Where is the cluster's state stored?`,``,[`On each pod`,`In etcd`,`In Docker Hub`,`In the scheduler's memory`],1,`Back up etcd and you can rebuild the cluster's objects.`),
 M(`What does kube-proxy do?`,``,[`Builds images`,`Sets up node networking rules so Service IPs reach the right pods`,`Schedules pods`,`Stores secrets`],1,`It programs iptables/IPVS rules on every node.`),
 M(`Deployment vs StatefulSet?`,``,[`Same`,`StatefulSet gives pods stable names and their own persistent storage, for databases`,`Deployment is for batch jobs`,`StatefulSet can't scale`],1,`Deployments treat pods as interchangeable; StatefulSets don't.`),
 M(`Scale pods on queue length instead of CPU?`,``,[`Impossible`,`HPA with custom or external metrics, or KEDA`,`Add more nodes`,`Use a CronJob`],1,`Reported in a Hyderabad DevOps interview: autoscaling beyond CPU and memory.`)]},
{id:'k6',u:`How things work: Infrastructure`,title:`Networking from DNS to HTTP`,steps:[
 Lr(`The layers that matter`,`DNS turns a name into an IP. TCP gives a reliable connection (SYN, SYN-ACK, ACK). TLS adds encryption and proves the server's identity with a certificate. HTTP rides on top.`,`dig +short example.com        # DNS
nc -vz example.com 443          # can TCP connect?
openssl s_client -connect example.com:443   # TLS + certificate
curl -I https://example.com     # HTTP headers`),
 M(`What does TLS give you?`,``,[`Faster pages`,`Encryption, integrity, and proof of the server's identity`,`Compression`,`Load balancing`],1,`The certificate, signed by a trusted CA, proves who you're talking to.`),
 M(`L4 vs L7 load balancer?`,``,[`Same`,`L4 routes by IP and port; L7 understands HTTP and can route by path, host or header`,`L7 is only for UDP`,`L4 terminates TLS always`],1,`Path-based routing (/api vs /web) needs L7.`),
 M(`App on a private subnet can't reach the internet even with a NAT gateway. Next check?`,``,[`Reinstall the OS`,`Route tables, security groups and network ACLs`,`DNS TTL`,`Disk space`],1,`Reported in a DevOps interview: after NAT, check SGs and NACLs for blocked ports.`)]},
{id:'k7',u:`How things work: Systems design`,title:`Reliability patterns`,steps:[
 Lr(`Fail well`,`Timeouts stop you waiting forever. Retries with exponential backoff and jitter recover from blips without stampedes. Circuit breakers stop calling a dependency that is down. Idempotency makes retries safe.`,`import random, time
for attempt in range(5):
    try:
        return call_api(timeout=5)
    except TimeoutError:
        time.sleep(min(30, 2 ** attempt) + random.random())  # backoff + jitter`),
 M(`What makes an operation idempotent?`,``,[`It's fast`,`Doing it twice has the same effect as doing it once`,`It never fails`,`It's async`],1,`PUT and DELETE should be idempotent; use idempotency keys for POST payments.`),
 M(`Why add jitter to retries?`,``,[`Looks nicer in logs`,`So thousands of clients don't retry at the same instant`,`Required by HTTP`,`To reduce latency`],1,`Synchronized retries create a thundering herd.`),
 M(`What does a circuit breaker do?`,``,[`Cuts power`,`After repeated failures, fails fast for a while instead of calling the broken service`,`Encrypts traffic`,`Restarts pods`],1,`It protects both you and the struggling dependency.`)]},
{id:'k8',u:`How things work: Systems design`,title:`Distributed systems basics`,steps:[
 Lr(`Scale, cache, queue`,`Scale out with stateless app servers behind a load balancer. Cache hot reads (cache-aside: check cache, else DB, then fill cache). Put slow work on a queue so the request returns fast. Replicate data for durability.`,`client → CDN → load balancer → app servers (stateless)
                                   ↓          ↓
                                 cache      queue → workers
                                   ↓
                              primary DB → replicas`),
 M(`CAP: during a network partition you must choose between…`,``,[`Speed and cost`,`Consistency and availability`,`CPU and memory`,`SQL and NoSQL`],1,`Partitions happen, so the real trade-off is C vs A while they last.`),
 M(`Biggest risk of caching?`,``,[`Too fast`,`Serving stale data; you need TTLs or invalidation`,`Uses CPU`,`Breaks HTTPS`],1,`"There are two hard things: cache invalidation and naming things."`),
 M(`Why put work on a message queue?`,``,[`To lose messages`,`Decouple services and absorb spikes; workers process at their own pace`,`To encrypt data`,`To replace the database`],1,`Producers and consumers can scale and fail independently.`)]},
{id:'k9',u:`How things work: Quality`,title:`Test design techniques`,steps:[
 Lr(`Fewer tests, more bugs found`,`Equivalence partitioning: one test per group of inputs that behave the same. Boundary value analysis: test at and around the edges, where bugs cluster. Pairwise: cover every pair of options instead of every combination.`,`# Field accepts 1–100
valid partition   → 50
invalid partitions → 0, 101, -5, "abc"
boundaries        → 0, 1, 2, 99, 100, 101`),
 M(`A field accepts 1–100. Best boundary values?`,``,[`50 only`,`0, 1, 100, 101`,`1 and 50`,`-1000 and 1000`],1,`Test just inside and just outside each edge.`),
 M(`What does "shift left" mean?`,``,[`Move testers to another team`,`Test earlier — in design, code review and CI — not only before release`,`Run tests in reverse`,`Delete old tests`],1,`Bugs found earlier are much cheaper to fix.`),
 M(`Verification vs validation?`,``,[`Same`,`Verification: built it right (meets spec). Validation: built the right thing (meets user need)`,`Validation is only for UI`,`Verification is manual only`],1,`Matters in regulated (GxP) testing roles too.`)]},
{id:'k10',u:`How things work: Quality`,title:`Infrastructure as Code concepts`,steps:[
 Lr(`Declarative, idempotent, stateful`,`You declare the end state; the tool works out the steps. Running it twice changes nothing the second time (idempotent). Terraform keeps state to map code to real resources; drift is when reality no longer matches.`,`terraform plan        # shows drift and planned changes
terraform import aws_s3_bucket.logs my-logs-bucket   # adopt existing resource
terraform state mv aws_instance.a aws_instance.b     # rename without recreating`),
 M(`What is Terraform drift?`,``,[`A slow apply`,`Real infrastructure changed outside Terraform and no longer matches state/code`,`A provider bug`,`A failed plan`],1,`plan reveals it; fix by updating code or re-applying.`),
 M(`count vs for_each?`,``,[`Same`,`count indexes by number (removing one shifts the rest); for_each keys by name, so items are stable`,`for_each is deprecated`,`count works only on modules`],1,`Prefer for_each for sets of named things.`),
 M(`How does state locking help?`,``,[`Speeds up plan`,`Stops two people applying at once and corrupting state`,`Encrypts state`,`Deletes old state`],1,`With an S3 backend, locking is typically handled via DynamoDB or S3 native locking.`)]}
,
{id:'k11',u:`How things work: Systems design`,title:`Design: URL shortener`,steps:[
 Lr(`Clarify, estimate, sketch`,`Ask the requirements first (custom aliases? expiry? analytics?), estimate scale (reads far outnumber writes), then sketch: API → app servers → key generator → database, with a cache for hot links.`,`POST /shorten {url}  → returns abc123
GET  /abc123         → 301/302 redirect to the long URL

key   = base62(counter or random), 7 chars ≈ 3.5 trillion keys
store = key → long_url, created_at, owner
cache = hot keys in Redis (reads ≫ writes)`),
 M(`Why base62 keys?`,``,[`Encryption`,`Short, URL-safe keys from a–z, A–Z, 0–9`,`Faster database`,`HTTP requires it`],1,`Seven characters already give trillions of combinations.`),
 M(`301 vs 302 for short links?`,``,[`Same`,`301 is cached by browsers (less load, weaker analytics); 302 hits you every time (better analytics)`,`302 is permanent`,`301 breaks HTTPS`],1,`A classic trade-off question — say which you'd pick and why.`),
 M(`Reads are 100× writes. What helps most?`,``,[`A bigger write database`,`A cache in front of the database`,`Longer keys`,`Batch inserts`],1,`Cache-aside on hot keys removes most database reads.`)]},
{id:'k12',u:`How things work: Systems design`,title:`Design: logs & metrics pipeline`,steps:[
 Lr(`Collect, buffer, store, query`,`Agents on each host ship logs into a buffer (Kafka) so spikes don't drop data; consumers parse and index them into storage (Loki or Elasticsearch); dashboards and alerts query it. Metrics take a separate, cheaper path through Prometheus.`,`app → agent (Fluent Bit) → Kafka → processor → Loki / Elasticsearch → Grafana
app → /metrics → Prometheus → Alertmanager → on-call`),
 M(`Why put Kafka in the middle?`,``,[`To encrypt logs`,`It buffers bursts and decouples producers from slower storage`,`It replaces storage`,`Grafana needs it`],1,`Backpressure without losing data.`),
 M(`Log storage is too expensive. First lever?`,``,[`Delete all logs`,`Cut debug noise, sample, and use retention tiers (hot 7 days, cold 90)`,`Only buy disks`,`Turn off metrics`],1,`Control volume first, then tier retention.`)]},
{id:'k13',u:`How things work: Systems design`,title:`Design: a CI/CD system`,steps:[
 Lr(`From commit to production`,`A webhook queues a pipeline; ephemeral runners build in clean containers; the artifact is versioned and immutable; deploys promote that same artifact through environments behind gates; every step is observable and reversible.`,`push → webhook → queue → runner (ephemeral container)
  → test → build image:sha → scan → registry
  → deploy staging → smoke tests → approval / canary → prod → monitor → auto-rollback`),
 M(`Why build once and promote the same artifact?`,``,[`Saves disk`,`What you tested is exactly what you ship`,`Faster typing`,`Docker requires it`],1,`Rebuilding per environment can pull different dependencies.`),
 M(`Why ephemeral runners?`,``,[`Always cheaper`,`Clean, reproducible builds with no leftover state or secrets`,`Shorter logs`,`Required by Git`],1,`Every job starts from a known image.`)]}

/*ADD-CON-LESSON*/
]},
sto:{name:`Storage`,lessons:[
{id:'s1',u:`Storage foundations`,title:`Block, file and object`,ref:[[`SNIA Online Dictionary`,`https://www.snia.org/resources/online-dictionary`],[`NIST SP 800-209 — Storage infrastructure`,`https://doi.org/10.6028/NIST.SP.800-209`]],steps:[
 Lr(`Three ways to present data`,`<b>Block</b> storage exposes raw volumes (LUNs) that a host formats with its own file system — databases and VMs live here, over Fibre Channel, iSCSI or NVMe-oF. <b>File</b> storage (NAS) shares a file system over the network with NFS or SMB. <b>Object</b> storage keeps data as objects with metadata in a flat namespace, reached over HTTP APIs such as S3 — built for huge scale, backups and archives.`,`DAS  → disk attached directly to one server
SAN  → block storage over a dedicated network (FC, iSCSI, NVMe-oF)
NAS  → file shares over the LAN (NFS for Linux/Unix, SMB for Windows)
Object → PUT/GET objects by key over HTTPS (e.g. S3 API)`),
 M(`A database needs low-latency volumes it formats itself. Best fit?`,``,[`Object storage`,`Block storage (SAN LUN)`,`A NAS share`,`Tape`],1,`Databases want raw block devices with consistent low latency.`,`Block storage hands the host a raw device; the host owns the file system and caching, so the database controls exactly how it writes. File shares add a network file-locking layer, and object storage is accessed whole-object over HTTP, which doesn't suit random small writes.`),
 M(`Which protocol pair is used for NAS file sharing?`,``,[`FC and iSCSI`,`NFS and SMB`,`S3 and Swift`,`SAS and SATA`],1,`NFS (mostly Linux/Unix) and SMB (mostly Windows) share files over the network.`,`FC and iSCSI carry block traffic (SAN); S3 is an object API; SAS and SATA are disk interfaces inside or next to a server.`),
 M(`Why is object storage popular for backups and archives?`,``,[`Lowest latency for databases`,`Scales to huge capacity cheaply, keeps rich metadata, and supports features like versioning and object lock`,`It needs no network`,`It's always faster than block`],1,`Scale, cost and data-protection features — not latency.`,`Object stores grow horizontally, store metadata with each object, and many support immutability (object lock / WORM), which matters for ransomware-resistant backup copies.`),
 F(`Linux hosts usually mount a NAS share with…`,`sudo mount -t ___ filer01:/exports/data /mnt/data`,[`nfs`,`s3`,`iscsi`,`ext4`],[`nfs`],`mount -t nfs mounts an NFS export; ext4 is a local file system, iSCSI presents a block device instead.`)]},
{id:'s2',u:`Storage foundations`,title:`RAID levels`,ref:[[`SNIA Online Dictionary — RAID terms`,`https://www.snia.org/resources/online-dictionary?alpha=R`]],steps:[
 Lr(`Trade capacity, speed and safety`,`RAID combines disks for performance or redundancy. RAID 0 stripes (fast, no protection). RAID 1 mirrors. RAID 5 stripes with single parity (survives one disk failure). RAID 6 uses double parity (survives two). RAID 10 mirrors then stripes — fast and resilient, but you lose half the capacity.`,`RAID 0   4×4 TB → 16 TB usable, 0 failures tolerated
RAID 1   2×4 TB →  4 TB usable, 1 failure
RAID 5   4×4 TB → 12 TB usable, 1 failure  (n-1 disks)
RAID 6   4×4 TB →  8 TB usable, 2 failures (n-2 disks)
RAID 10  4×4 TB →  8 TB usable, 1 per mirror pair`),
 M(`Six 10 TB disks in RAID 6. Usable capacity?`,``,[`60 TB`,`50 TB`,`40 TB`,`30 TB`],2,`RAID 6 spends two disks' worth on parity: (6 − 2) × 10 = 40 TB.`,`Parity in RAID 6 is spread across all disks, but the capacity cost always equals two disks. RAID 5 would give 50 TB; RAID 10 would give 30 TB.`),
 M(`Why is RAID 6 preferred over RAID 5 for large HDDs?`,``,[`It's faster for writes`,`Long rebuilds of big disks raise the chance of a second failure; RAID 6 survives it`,`It uses fewer disks`,`RAID 5 is deprecated by law`],1,`Large disks take hours or days to rebuild — a second failure during that window kills RAID 5.`,`During a rebuild every remaining disk is read end to end, so the risk of hitting another failure or an unreadable sector grows with capacity. Double parity covers that window. RAID 6 actually has a higher write penalty than RAID 5.`),
 M(`Is RAID a backup?`,``,[`Yes, if it's RAID 6`,`No — RAID protects against disk failure, not deletion, corruption or ransomware`,`Yes, if it's RAID 10`,`Only with hot spares`],1,`RAID faithfully replicates mistakes: a deleted or encrypted file is deleted or encrypted on every disk.`,`Availability and recoverability are different goals. You still need separate point-in-time copies — snapshots plus backups kept on other media and locations.`)]},
{id:'s3',u:`Storage foundations`,title:`Replication & erasure coding`,ref:[[`SNIA Educational Library`,`https://www.snia.org/educational-library`]],steps:[
 Lr(`Copies across sites and nodes`,`<b>Synchronous</b> replication acknowledges a write only after the remote copy has it — zero data loss, but latency limits distance. <b>Asynchronous</b> replication acknowledges locally and ships changes later — any distance, small data loss possible. <b>Erasure coding</b> splits data into k data fragments plus m parity fragments, so any k fragments rebuild it — cheaper than full copies at scale.`,`sync   : write → local + remote → ack     (RPO ≈ 0, short distance)
async  : write → local → ack → remote later (RPO = replication lag)
EC 8+3 : 11 fragments, survives any 3 losses, overhead 3/8 = 37.5%
3× replication: survives 2 losses, overhead 200%`),
 M(`You need zero data loss between two data centres 20 km apart. Choose…`,``,[`Asynchronous replication`,`Synchronous replication`,`Nightly backup`,`Erasure coding on one node`],1,`Synchronous replication gives RPO ≈ 0; 20 km keeps the round-trip latency acceptable.`,`Every write waits for the remote ack, so distance adds latency to each write — practical within metro distances. Async would lose whatever hadn't shipped yet.`),
 M(`Why do large object stores prefer erasure coding to 3× replication?`,``,[`Faster small writes`,`Similar durability with far less raw capacity`,`No CPU needed`,`It works without a network`],1,`EC 8+3 tolerates 3 failures at 37.5% overhead; 3× replication tolerates 2 at 200%.`,`The cost is CPU for encoding and more network traffic during rebuilds, which is why small hot data is often replicated and big cold data erasure-coded.`),
 M(`A split-brain happens when…`,``,[`A disk is split into partitions`,`Two sites lose contact and both act as primary, accepting conflicting writes`,`RAID rebuild runs twice`,`Replication is too fast`],1,`Avoid it with quorum or a witness so only one side keeps serving writes.`,`GitHub's October 2018 incident (in the Real world track) shows how painful reconciling writes from two sides can be.`)]},
{id:'s4',u:`Data protection`,title:`Snapshots, clones and backups`,ref:[[`SNIA Online Dictionary — backup, snapshot`,`https://www.snia.org/resources/online-dictionary?alpha=B`],[`IBM Storage Protect documentation`,`https://www.ibm.com/docs/en/storage-protect`]],steps:[
 Lr(`Point-in-time copies`,`A <b>snapshot</b> is a fast point-in-time view on the same system, usually copy-on-write or redirect-on-write — great for quick rollback, but it shares the original's fate if the array fails. A <b>backup</b> is an independent copy on separate media or location. Backups can be full, incremental (changes since the last backup of any kind) or differential (changes since the last full).`,`Full         : everything, every time      → slow backup, simple restore
Incremental  : changes since LAST backup   → fast backup, restore = full + every incremental
Differential : changes since LAST FULL     → grows daily, restore = full + latest differential
Incremental-forever: one full, then only changes (used by IBM Storage Protect)`),
 M(`Restore needs the fewest pieces with which scheme (after the full)?`,``,[`Incremental`,`Differential`,`Both the same`,`Neither needs the full`],1,`Differential: restore = last full + the single latest differential.`,`Incremental restore = full + every incremental in order, so a broken link in the chain breaks the restore. Modern incremental-forever systems solve this by tracking file versions in a database, so the server assembles the restore for you.`),
 M(`Why isn't a snapshot alone enough protection?`,``,[`Snapshots are too slow`,`It lives on the same system — array failure, site loss or admin-level ransomware can take both`,`Snapshots can't be restored`,`They only work on Windows`],1,`Snapshots are for quick rollback; backups and off-site copies are for disasters.`,`Combine them: frequent snapshots for minutes-level RPO, plus backups replicated off-site and kept immutable.`),
 M(`Copy-on-write snapshots work by…`,``,[`Copying the whole volume at snapshot time`,`Copying a block to the snapshot area only when it's about to be overwritten`,`Compressing the volume`,`Pausing all writes for an hour`],1,`Only changed blocks cost space, which is why snapshots are instant and small at first.`,`The trade-off: each first write to a block costs an extra read and write, and many long-lived snapshots can slow the volume and consume space.`)]},
{id:'s5',u:`Data protection`,title:`RPO, RTO & disaster recovery`,ref:[[`NIST SP 800-34 Rev. 1 — Contingency planning`,`https://doi.org/10.6028/NIST.SP.800-34r1`],[`CISA #StopRansomware Guide`,`https://www.cisa.gov/stopransomware/ransomware-guide`]],steps:[
 Lr(`How much loss, how much downtime`,`<b>RPO</b> (recovery point objective) is the maximum data loss you accept, measured in time — backups every 4 hours means up to 4 hours lost. <b>RTO</b> (recovery time objective) is how long until service is back. A business impact analysis (BIA) sets both per system. The 3-2-1 rule: 3 copies, on 2 media types, 1 off-site; many add 1 immutable or offline copy and 0 errors in restore tests (3-2-1-1-0).`,`RPO 15 min → snapshots/replication at least every 15 min
RTO 1 hour → standby ready, automated failover, tested runbook
3-2-1-1-0 → 3 copies · 2 media · 1 off-site · 1 immutable/offline · 0 restore errors`),
 M(`Backups run nightly at 1 am. Disk dies at 6 pm. Worst-case data loss?`,``,[`1 hour`,`About 17 hours`,`24 hours`,`None`],1,`Everything since 1 am is lost — 17 hours. That's your effective RPO.`,`Effective RPO equals the time since the last good copy. If the business needs less, increase frequency or add snapshots/replication.`),
 M(`RTO measures…`,``,[`How much data you can lose`,`How quickly the service must be restored`,`Backup storage size`,`Replication bandwidth`],1,`RPO = data loss (looking back); RTO = downtime (looking forward).`,`A common interview trap: mixing them up. Say both with examples.`),
 M(`What's the only real proof backups work?`,``,[`The job log says success`,`Regular, measured restore tests`,`Backup size grows daily`,`The vendor says so`],1,`A backup you've never restored is a hope, not a plan — the "0" in 3-2-1-1-0.`,`Restore tests catch missing files, broken chains, expired keys and also measure your real RTO.`),
 Lr(`Your BCP story`,`Your own BCP/BCM work across three sites maps directly to this: name the BIA, the RPO/RTO you set per service, how you tested recovery, and what you'd improve. Write it in Roles → Stories.`)]},
{id:'s6',u:`Data protection`,title:`Deduplication & compression`,ref:[[`SNIA Online Dictionary — data deduplication`,`https://www.snia.org/resources/online-dictionary?alpha=D`]],steps:[
 Lr(`Store each chunk once`,`Deduplication splits data into chunks, fingerprints each one with a hash, and stores a chunk only if its hash is new; duplicates become pointers. <b>Inline</b> dedup happens before data is written (saves capacity immediately, costs CPU on the write path); <b>post-process</b> dedup runs later. Compression shrinks each chunk further. Backups dedup extremely well because most data is unchanged day to day.`,`chunk → hash (e.g. SHA-256) → seen before?
   yes → store a pointer
   no  → compress, store chunk, record hash in index
data reduction ratio = logical size / physical size   (e.g. 100 TB / 10 TB = 10:1)`),
 M(`Why do backups get higher dedup ratios than databases?`,``,[`Backups use better disks`,`Daily backups repeat mostly unchanged data`,`Databases can't be hashed`,`Backups are smaller`],1,`Repeated full or incremental-forever data shares most chunks with yesterday's.`,`Already-compressed or encrypted data (media files, encrypted volumes) dedups poorly because identical content no longer looks identical.`),
 M(`Encrypting data BEFORE sending it to a deduplicating target will…`,``,[`Improve dedup`,`Destroy most dedup savings`,`Have no effect`,`Speed up restores`],1,`Encryption makes every block look random, so duplicates can't be detected.`,`That's why systems often dedup first and then encrypt at the target, or use client-side dedup before encryption.`)]},
{id:'s7',u:`Performance`,title:`NVMe, IOPS and latency`,ref:[[`NVM Express — specifications`,`https://nvmexpress.org/specifications/`],[`SNIA Educational Library — NVMe-oF`,`https://www.snia.org/educational-library`]],steps:[
 Lr(`The numbers that matter`,`<b>IOPS</b> = operations per second (small random I/O). <b>Throughput</b> = MB/s (large sequential I/O). <b>Latency</b> = time per operation. They're linked by queue depth: throughput = IOPS × I/O size. NVMe talks to flash over PCIe with many deep queues, cutting latency compared with SAS/SATA; NVMe-oF extends that over a network (RDMA, TCP or Fibre Channel).`,`throughput = IOPS × block size
  20,000 IOPS × 4 KiB  ≈ 80 MB/s
  2,000 IOPS × 1 MiB   ≈ 2 GB/s
Little's law: queue depth = IOPS × latency
  50,000 IOPS × 0.2 ms = 10 outstanding I/Os

fio --name=randread --rw=randread --bs=4k --iodepth=32 --size=1G`),
 M(`A database does many small random reads. Which metric matters most?`,``,[`MB/s throughput`,`IOPS and latency`,`Disk capacity`,`RAID level only`],1,`Small random I/O is limited by operations per second and per-operation latency.`,`Backups and video streams care about MB/s; OLTP databases care about IOPS and tail latency (p99).`),
 M(`50,000 IOPS of 8 KiB blocks is roughly…`,``,[`40 MB/s`,`400 MB/s`,`4 GB/s`,`8 MB/s`],1,`50,000 × 8 KiB ≈ 400 MB/s.`,`Multiply IOPS by block size, then convert units. Being able to do this quickly impresses in storage interviews.`),
 M(`What does NVMe-oF add over local NVMe?`,``,[`Bigger SSDs`,`NVMe commands carried across a network fabric, so shared storage keeps near-local latency`,`RAID 6`,`Deduplication`],1,`Transports include RDMA (RoCE), TCP and Fibre Channel.`,`It replaces SCSI-based iSCSI/FC protocols for flash arrays, reducing protocol overhead.`)]},
{id:'s8',u:`Performance`,title:`Storage security & ransomware`,ref:[[`NIST SP 800-209 — Security Guidelines for Storage Infrastructure`,`https://doi.org/10.6028/NIST.SP.800-209`],[`CISA #StopRansomware Guide`,`https://www.cisa.gov/stopransomware/ransomware-guide`]],steps:[
 Lr(`Protect the last line of defence`,`Attackers target backups first, so storage security matters. NIST SP 800-209 covers storage-specific areas such as data protection, isolation, restoration assurance and encryption, alongside general controls like authentication, change management and incident response. In practice: immutable (WORM) copies, an isolated or air-gapped copy, encryption at rest and in flight, MFA and least privilege for storage admins, SAN zoning and LUN masking, and alerts on mass deletion or unusual change rates.`,`Zoning      → which FC ports can talk (switch level)
LUN masking → which hosts can see which LUNs (array level)
Immutability → object lock / WORM retention: no one can delete early, not even admins
Air gap     → copy not reachable from the production network`),
 M(`Ransomware got domain admin. Which backup copy survives?`,``,[`Snapshots on the same array with admin access`,`An immutable copy with retention lock, managed under separate credentials`,`A NAS share mapped on every server`,`A second RAID group`],1,`Immutability plus separate credentials means even a stolen admin account can't delete it early.`,`Defence in depth: isolate backup admin accounts, require MFA, and alert on retention changes or mass expiry.`),
 M(`Zoning vs LUN masking?`,``,[`Same thing`,`Zoning limits which ports talk on the FC fabric; LUN masking limits which hosts see which volumes on the array`,`Masking is for NAS only`,`Zoning encrypts data`],1,`Two layers of SAN access control at different points.`,`Use both: a mis-zoned host still can't see a LUN that isn't masked to it.`),
 M(`Encryption "in flight" protects…`,``,[`Data on disk`,`Data travelling over the network`,`Data in RAM only`,`Deleted data`],1,`In flight = in transit (TLS, IPsec, FC encryption); at rest = on media.`,`Interviewers often ask for both plus key management: keys stored apart from data, rotated, and access-logged.`)]},
{id:'s9',u:`Performance`,title:`Kubernetes storage`,ref:[[`Kubernetes docs — Persistent Volumes`,`https://kubernetes.io/docs/concepts/storage/persistent-volumes/`],[`Kubernetes docs — Storage Classes`,`https://kubernetes.io/docs/concepts/storage/storage-classes/`]],steps:[
 Lr(`PV, PVC, StorageClass, CSI`,`A pod asks for storage with a <b>PersistentVolumeClaim</b> (size, access mode). A <b>StorageClass</b> tells a <b>CSI</b> driver how to provision a matching <b>PersistentVolume</b> dynamically. Access modes include ReadWriteOnce (one node), ReadOnlyMany and ReadWriteMany (many nodes, e.g. NFS).`,`apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 20Gi`),
 M(`Three pods on different nodes must write to the same volume. Access mode?`,``,[`ReadWriteOnce`,`ReadWriteMany`,`ReadOnlyMany`,`Any mode works`],1,`Multiple nodes writing need RWX — typically file storage such as NFS.`,`RWO volumes (most block storage) attach to one node at a time; a second node's pod stays Pending.`),
 M(`A PVC stays Pending forever. Likely cause?`,``,[`The pod is too small`,`No StorageClass/provisioner can satisfy it (wrong class name, capacity, or access mode)`,`etcd is full`,`Too many Services`],1,`Check kubectl describe pvc — the events usually say why.`,`Common causes: a typo in storageClassName, no default StorageClass, a CSI driver not installed, or asking for RWX from a block-only driver.`),
 M(`What does reclaimPolicy: Retain do?`,``,[`Deletes data with the PVC`,`Keeps the volume and its data after the PVC is deleted, for manual cleanup`,`Backs up the volume`,`Shrinks the volume`],1,`Retain protects data from accidental PVC deletion; Delete removes the backing storage.`,`Production databases often use Retain plus regular snapshots via CSI VolumeSnapshot.`)]}
]}
,
sec:{name:`Security`,lessons:[
{id:'x1',u:`Security+ 1 · General concepts (12%)`,title:`CIA, AAA and zero trust`,ref:[[`CompTIA Security+ SY0-701 — official exam page & objectives`,`https://www.comptia.org/en-us/certifications/security/v7/`],[`NIST Cybersecurity Framework 2.0`,`https://www.nist.gov/cyberframework`]],steps:[
 Lr(`The vocabulary of security`,`<b>CIA</b>: confidentiality (only the right people see it), integrity (it isn't altered undetected), availability (it's there when needed). <b>AAA</b>: authentication (who are you), authorization (what may you do), accounting (what did you do — logs). <b>Non-repudiation</b>: you can't deny an action, e.g. thanks to a digital signature. <b>Zero trust</b>: never trust by network location; verify every request using identity, device posture and policy.`,`Encryption        → confidentiality
Hashes, signatures → integrity (+ non-repudiation with signatures)
Redundancy, backups → availability
Zero trust: policy engine decides → policy enforcement point allows/blocks each request`),
 M(`A ransomware attack encrypts your files. Which CIA property is hit first?`,``,[`Confidentiality`,`Integrity`,`Availability`,`Non-repudiation`],2,`You can't use your data — availability. Double-extortion gangs also steal data, hitting confidentiality.`,`Map each attack to the property it breaks: DDoS → availability; data leak → confidentiality; tampering → integrity. Modern ransomware often hits all three.`),
 M(`MFA strengthens which "A" of AAA?`,``,[`Authentication`,`Authorization`,`Accounting`,`Availability`],0,`MFA proves identity with two or more factor types: something you know, have, or are.`,`Two passwords are still one factor type. Authorization is what you're allowed to do after login; accounting is the audit trail.`),
 M(`Core idea of zero trust?`,``,[`Trust everything inside the firewall`,`Verify every request explicitly, grant least privilege, and assume breach`,`Block all traffic`,`Use only VPNs`],1,`Network location alone grants nothing.`,`In Security+ terms, the control plane (policy engine, policy administrator) decides and the data plane (policy enforcement point) enforces each access.`),
 M(`A camera that records a server room is which control type?`,``,[`Preventive`,`Detective`,`Corrective`,`Compensating`],1,`It detects and records; it doesn't stop entry.`,`Preventive stops (a lock), detective notices (camera, IDS), corrective fixes (restore from backup), compensating substitutes when the ideal control isn't possible.`)]},
{id:'x2',u:`Security+ 1 · General concepts (12%)`,title:`Cryptography and PKI`,ref:[[`CompTIA Security+ SY0-701 objectives`,`https://www.comptia.org/en-us/certifications/security/v7/`]],steps:[
 Lr(`Keys, hashes and certificates`,`<b>Symmetric</b> crypto (AES) uses one shared key — fast, used for bulk data. <b>Asymmetric</b> crypto (RSA, ECC) uses a public/private key pair — used to exchange keys and sign. A <b>hash</b> (SHA-256) is a one-way fingerprint; <b>salting</b> passwords before hashing defeats precomputed rainbow tables. A <b>certificate</b> binds a public key to an identity and is signed by a certificate authority (CA).`,`TLS in one line: asymmetric to agree keys + verify the server's certificate → symmetric (AES) for the data
Digital signature: hash(message) signed with the sender's PRIVATE key → anyone verifies with the PUBLIC key
Store passwords as: slow_hash(password + unique salt)  (bcrypt, scrypt, Argon2, PBKDF2)`),
 M(`Alice signs a message. Bob verifies it with…`,``,[`Alice's private key`,`Alice's public key`,`Bob's private key`,`A shared AES key`],1,`Sign with your private key; anyone verifies with your public key.`,`Encryption is the reverse: encrypt to Bob with Bob's public key, and only Bob's private key decrypts. Signing gives integrity and non-repudiation.`),
 M(`Why salt password hashes?`,``,[`Makes hashing faster`,`Identical passwords get different hashes, defeating rainbow tables`,`Lets you decrypt passwords`,`Required for AES`],1,`A unique random salt per user makes precomputed tables useless.`,`Also use a deliberately slow algorithm (bcrypt, Argon2) so brute force is expensive. Never encrypt passwords reversibly.`),
 M(`Which is NOT reversible by design?`,``,[`AES`,`RSA`,`SHA-256`,`ChaCha20`],2,`Hashes are one-way; the others are ciphers designed to be decrypted with a key.`,`Use hashing for integrity checks and password storage; use encryption when you must get the data back.`),
 M(`A browser warns the certificate is untrusted. Most likely?`,``,[`The site uses AES`,`The certificate is self-signed, expired, or for a different hostname`,`The server is too fast`,`TLS 1.3 is enabled`],1,`The chain must lead to a trusted root CA, be in date, and match the hostname.`,`openssl s_client -connect host:443 -servername host shows the chain and dates — a handy SRE check too.`)]},
{id:'x3',u:`Security+ 2 · Threats & vulnerabilities (22%)`,title:`Threats and attacks`,ref:[[`CompTIA Security+ SY0-701 objectives`,`https://www.comptia.org/en-us/certifications/security/v7/`],[`MITRE ATT&CK`,`https://attack.mitre.org/`]],steps:[
 Lr(`Know the attacker's playbook`,`Social engineering (phishing, smishing, vishing, pretexting, business email compromise) targets people. Malware includes ransomware, trojans, worms (self-spreading), rootkits and keyloggers. Password attacks: brute force, dictionary, password spraying (one common password across many accounts), credential stuffing (reusing leaked pairs). Supply-chain attacks compromise a vendor or dependency to reach many victims.`,`Spraying   : 1 password  × many accounts  → evades lockouts
Stuffing   : leaked user:pass pairs × other sites → works when people reuse passwords
Mitigations: MFA, lockout/throttling, breached-password checks, user training`),
 M(`Hundreds of accounts each get one login attempt with "Winter2026!". This is…`,``,[`Brute force`,`Password spraying`,`Credential stuffing`,`Rainbow table attack`],1,`One common password across many accounts stays under lockout thresholds.`,`Brute force hammers one account with many passwords; stuffing replays leaked username/password pairs.`),
 M(`Malware that spreads across the network on its own is a…`,``,[`Trojan`,`Worm`,`Keylogger`,`Logic bomb`],1,`Worms self-propagate; trojans need a user to run them.`,`A logic bomb waits for a trigger (a date or event); a keylogger records keystrokes.`),
 M(`An attacker poisons a popular open-source package your build pulls in. Category?`,``,[`Phishing`,`Supply-chain attack`,`DDoS`,`SQL injection`],1,`Compromising something you trust upstream reaches you indirectly.`,`OWASP Top 10:2025 added Software Supply Chain Failures (A03). Defences: pin versions, verify signatures and checksums, keep an SBOM, scan dependencies in CI.`)]},
{id:'x4',u:`Security+ 2 · Threats & vulnerabilities (22%)`,title:`OWASP Top 10:2025`,ref:[[`OWASP Top 10:2025 (official)`,`https://owasp.org/Top10/2025/`]],steps:[
 Lr(`The web risks developers must know`,`OWASP's 2025 list starts with A01 Broken Access Control, A02 Security Misconfiguration and A03 Software Supply Chain Failures (new), then A04 Cryptographic Failures and A05 Injection. Later entries include A08 Software or Data Integrity Failures, A09 Security Logging & Alerting Failures, and the new A10 Mishandling of Exceptional Conditions. Read each category's prevention section on owasp.org.`,`# Injection: never build SQL with string formatting
cur.execute("SELECT * FROM users WHERE id = " + user_id)     # vulnerable
cur.execute("SELECT * FROM users WHERE id = %s", (user_id,)) # parameterised

# Broken access control: check ownership on EVERY request
if order.owner_id != current_user.id: abort(403)`),
 M(`Changing /orders/1001 to /orders/1002 shows another customer's order. Which risk?`,``,[`Injection`,`Broken access control`,`Cryptographic failure`,`Supply chain`],1,`This is an insecure direct object reference — the server never checks ownership. It falls under A01.`,`Fix it server-side: authorise every object access against the logged-in user. Hiding IDs is not a control.`),
 M(`Best fix for SQL injection?`,``,[`Escape quotes by hand`,`Parameterised queries / prepared statements`,`Hide error messages`,`Use HTTPS`],1,`Parameters keep data separate from the SQL code.`,`Add least-privilege DB accounts and input validation as extra layers, but parameterisation is the core fix.`),
 M(`Default admin credentials left on a production dashboard fall under…`,``,[`A02 Security Misconfiguration`,`A05 Injection`,`A10 Exceptional conditions`,`A04 Cryptographic Failures`],0,`Defaults, open debug pages and unnecessary services are misconfiguration — #2 in 2025.`,`Prevention: hardened baselines, infrastructure as code reviewed in PRs, and automated configuration scanning.`)]},
{id:'x5',u:`Security+ 3 · Architecture (18%)`,title:`Secure architecture & cloud`,ref:[[`CompTIA Security+ SY0-701 objectives`,`https://www.comptia.org/en-us/certifications/security/v7/`],[`NIST SP 800-209 — storage security controls`,`https://doi.org/10.6028/NIST.SP.800-209`]],steps:[
 Lr(`Design for containment`,`Segment networks so one breach can't reach everything (VLANs, subnets, security groups, Kubernetes NetworkPolicies). Put internet-facing services in a DMZ. In the cloud, the <b>shared responsibility model</b> applies: the provider secures the cloud itself; you secure what you put in it — identities, data, configuration. Keep secrets in a vault, scan infrastructure-as-code, and prefer immutable, patched images.`,`IaaS: you manage OS, apps, data, identities
PaaS: you manage apps, data, identities
SaaS: you manage data, identities, configuration
Always yours: data and who can access it`),
 M(`In IaaS, who patches the guest operating system?`,``,[`The cloud provider`,`The customer`,`Nobody`,`The hypervisor vendor`],1,`In IaaS the OS and everything above it are yours.`,`The provider patches the physical hosts and hypervisor. In PaaS the provider manages the OS; in SaaS nearly everything except your data, identities and settings.`),
 M(`Why segment the network?`,``,[`To speed up Wi-Fi`,`To limit lateral movement and blast radius`,`To avoid using firewalls`,`To reduce DNS lookups`],1,`If one host is compromised, segmentation keeps the attacker from reaching everything.`,`In Kubernetes, a default-deny NetworkPolicy plus explicit allows is the same idea.`),
 M(`Where should a pipeline's cloud credentials live?`,``,[`In the repository`,`In a secrets manager, ideally short-lived via workload identity federation (OIDC)`,`In the Dockerfile`,`In a wiki page`],1,`Short-lived, scoped credentials beat long-lived keys.`,`OIDC federation lets CI get temporary cloud credentials without storing any secret at all.`)]},
{id:'x6',u:`Security+ 4 · Operations (28%)`,title:`Identity, logging & vulnerabilities`,ref:[[`CompTIA Security+ SY0-701 objectives`,`https://www.comptia.org/en-us/certifications/security/v7/`],[`FIRST — CVSS`,`https://www.first.org/cvss/`]],steps:[
 Lr(`Day-to-day security work`,`Identity: SSO, MFA, role-based access (RBAC), least privilege, and regular access reviews; remove access promptly when people leave. Logging: collect logs centrally (a SIEM), keep time in sync, alert on suspicious patterns. Vulnerability management: scan, prioritise by severity (CVSS) and real exploitability, patch, then verify.`,`Vuln workflow: discover → assess (CVSS + exploited in the wild? + exposure) → remediate/mitigate → verify → report
CVSS 9.0–10.0 Critical · 7.0–8.9 High · 4.0–6.9 Medium · 0.1–3.9 Low`),
 M(`An employee changes team but keeps old permissions for years. This is…`,``,[`Privilege escalation`,`Permission creep — fix with access reviews and least privilege`,`Phishing`,`Non-repudiation`],1,`Access accumulates unless it's reviewed and removed.`,`Joiner-mover-leaver processes plus periodic access recertification prevent it.`),
 M(`Two vulnerabilities: CVSS 9.8 on an internal test box, CVSS 7.5 actively exploited on an internet-facing server. Patch first?`,``,[`The 9.8, always`,`The 7.5 exposed and exploited one — real risk beats raw score`,`Neither`,`Whichever is older`],1,`Prioritise by exploitation and exposure, not just score.`,`Catalogues of known exploited vulnerabilities help make this call quickly.`),
 M(`Why do log timestamps need NTP time sync?`,``,[`Smaller logs`,`To correlate events across systems during an investigation`,`Faster disks`,`For encryption`],1,`Out-of-sync clocks make an incident timeline impossible to reconstruct.`,`This is also why SREs insist on UTC timestamps in logs.`)]},
{id:'x7',u:`Security+ 4 · Operations (28%)`,title:`Incident response`,ref:[[`NIST SP 800-61 Rev. 3 (April 2025)`,`https://csrc.nist.gov/pubs/sp/800/61/r3/final`],[`NIST Cybersecurity Framework 2.0`,`https://www.nist.gov/cyberframework`]],steps:[
 Lr(`From alert to lessons learned`,`Security+ lists the incident response process as preparation, detection, analysis, containment, eradication, recovery and lessons learned. NIST's April 2025 SP 800-61 Rev. 3 recasts incident response around the six CSF 2.0 functions — Govern, Identify, Protect, Detect, Respond, Recover — so response is part of overall risk management, not a separate silo.`,`Contain   → isolate the host, disable the account, block the IP (stop the spread)
Eradicate → remove malware, close the hole, rotate credentials
Recover   → restore from clean backups, monitor closely
Lessons   → blameless review, fix detection gaps`),
 M(`A laptop shows ransomware activity. First priority?`,``,[`Wipe it immediately`,`Contain it — isolate it from the network`,`Email the whole company`,`Pay the ransom`],1,`Containment stops the spread; evidence is kept for analysis.`,`Wiping first destroys evidence and may miss how the attacker got in. Isolate (EDR network containment or unplug), then analyse.`),
 M(`Which function did NIST CSF 2.0 add?`,``,[`Identify`,`Govern`,`Recover`,`Detect`],1,`Govern sits at the centre of the other five: Identify, Protect, Detect, Respond, Recover.`,`Govern covers strategy, roles, policy, oversight and supply-chain risk.`),
 M(`Rotating all service credentials after a breach belongs to…`,``,[`Preparation`,`Eradication`,`Lessons learned`,`Detection`],1,`Removing the attacker's footholds — malware, backdoors, stolen secrets — is eradication.`,`Recovery is bringing systems back; lessons learned improves the process afterwards.`)]},
{id:'x8',u:`Security+ 5 · Program management (20%)`,title:`Risk, governance & compliance`,ref:[[`CompTIA Security+ SY0-701 objectives`,`https://www.comptia.org/en-us/certifications/security/v7/`],[`NIST CSF 2.0 resources`,`https://www.nist.gov/cyberframework`]],steps:[
 Lr(`Talk like a risk owner`,`Risk combines likelihood and impact. Responses: <b>mitigate</b> (add controls), <b>transfer</b> (insurance, contracts), <b>avoid</b> (stop the activity), <b>accept</b> (documented and signed off). Quantitative risk uses ALE = SLE × ARO (single loss expectancy × annual rate of occurrence). Data roles: owner (accountable), custodian (operates it), controller and processor (privacy law terms).`,`SLE = asset value × exposure factor
ALE = SLE × ARO
e.g. ₹10,00,000 × 0.4 = ₹4,00,000 SLE; occurs once in 2 years → ARO 0.5 → ALE ₹2,00,000/year`),
 M(`Buying cyber insurance is which risk response?`,``,[`Mitigate`,`Transfer`,`Avoid`,`Accept`],1,`You shift the financial impact to a third party.`,`Insurance doesn't reduce likelihood — you still need controls.`),
 M(`SLE ₹5,00,000 and ARO 0.2. ALE?`,``,[`₹25,00,000`,`₹1,00,000`,`₹5,00,000`,`₹50,000`],1,`ALE = 5,00,000 × 0.2 = ₹1,00,000 per year.`,`ALE tells you the most you should spend per year on a control for that risk.`),
 M(`Who is ultimately accountable for a dataset's classification?`,``,[`The custodian`,`The data owner`,`The end user`,`The auditor`],1,`Owners decide classification and access; custodians implement and operate the controls.`,`Storage and backup admins are usually custodians — a useful way to describe your own role in interviews.`)]}
]}
,
rw:{name:`Real world`,lessons:[
{id:'r1',u:`Learn from real outages`,title:`GitHub, Oct 2018: 43 seconds, 24 hours`,ref:[[`GitHub — October 21 post-incident analysis (official)`,`https://github.blog/2018-10-30-oct21-post-incident-analysis/`]],steps:[
 Lr(`What happened`,`During routine maintenance to replace failing 100G optical equipment, GitHub lost connectivity between its US East Coast network hub and primary East Coast data centre. Connectivity came back in 43 seconds, but the database orchestration had already promoted primaries on the West Coast. Both sides now held writes the other didn't, so GitHub couldn't simply fail back. Service was degraded for 24 hours and 11 minutes while they restored and reconciled data.`,`Trigger      : brief network partition during maintenance
Amplifier    : automatic cross-country DB failover (Orchestrator)
Hard part    : divergent writes in two data centres
Decision     : prioritise data consistency over fast recovery
Result       : 24h 11m degraded, no user data lost`),
 M(`What made a 43-second blip become a day-long incident?`,``,[`A DDoS attack`,`Automated failover moved primaries cross-country, leaving writes in two places that couldn't be merged automatically`,`Disk failure`,`An expired certificate`],1,`The failover itself created divergent data.`,`Automation needs guardrails that match what applications can tolerate — GitHub noted Orchestrator could pick topologies its apps couldn't support. Lesson: test failover paths, including partial partitions.`),
 M(`GitHub chose a longer outage to protect data consistency. In CAP terms they chose…`,``,[`Availability over consistency`,`Consistency over availability`,`Partition tolerance off`,`Neither`],1,`During the partition and recovery, they degraded service rather than risk inconsistent user data.`,`Being able to name this trade-off with a real example is strong interview material.`),
 M(`A key communication lesson GitHub noted?`,``,[`Never post updates`,`Updates came later than intended and the early two-hour recovery estimate proved far too short — communicate early, often and honestly`,`Only tweet`,`Hide the incident`],1,`Users needed more timely updates during the long recovery.`,`In an incident, a communications lead posting regular, honest updates is part of the response.`)]},
{id:'r2',u:`Learn from real outages`,title:`AWS us-east-1, Dec 2021`,ref:[[`AWS — Summary of the Service Event in US-EAST-1 (official)`,`https://aws.amazon.com/message/12721`],[`AWS Post-Event Summaries`,`https://aws.amazon.com/premiumsupport/technology/pes/`]],steps:[
 Lr(`What happened`,`At 7:30 AM PST an automated activity to scale capacity of an AWS service triggered unexpected behaviour from many clients on AWS's internal network. The surge overwhelmed the devices connecting the internal and main networks, and a latent bug stopped clients backing off properly, so retries kept the congestion going. Internal DNS, monitoring and parts of the EC2 control plane suffered; running instances kept working. Network devices fully recovered around 2:22 PM PST.`,`Trigger     : automated scaling event
Amplifier   : retry storm — clients didn't back off (latent bug)
Side effect : monitoring and the status dashboard were impaired too
Fixes       : disable the scaling activity, fix back-off, protect network devices, multi-region support system`),
 M(`What turned a scaling event into a long outage?`,``,[`A hacked account`,`Clients retried without proper back-off, creating sustained congestion`,`A disk failure`,`A DNS typo`],1,`A retry storm — the reliability patterns lesson (k7) in real life.`,`Retries without exponential back-off and jitter amplify load exactly when a system is weakest.`),
 M(`Why was diagnosis slow?`,``,[`Engineers were offline`,`The same congestion impaired the monitoring they relied on, so they fell back to logs`,`No logs existed`,`Too many dashboards`],1,`Monitoring shared fate with the failing network.`,`Lesson: keep a monitoring and communication path that doesn't depend on the system being watched.`),
 M(`Which design choice let running EC2 instances keep working?`,``,[`They used RAID 6`,`Separation between the data plane (running workloads) and the control plane (APIs)`,`They were all in one AZ`,`They had no network`],1,`Control-plane problems blocked launches and API calls, but the data plane kept serving.`,`Designing so the data plane survives control-plane failures is a core cloud reliability principle.`)]},
{id:'r3',u:`Learn from real outages`,title:`Cloudflare, Nov 2025: a config file`,ref:[[`Cloudflare — Outage on November 18, 2025 (official)`,`https://blog.cloudflare.com/18-november-2025-outage/`]],steps:[
 Lr(`What happened`,`A database permissions change made a query return duplicate rows, roughly doubling the size of a Bot Management "feature file" that is regenerated every five minutes and pushed across the network. The proxy had a hard limit on features; the oversized file exceeded it and the code panicked, returning HTTP 5xx errors. Because only some database nodes produced the bad file at first, the network flipped between working and failing — which made engineers first suspect a DDoS. Core traffic recovered after they stopped the bad file and rolled back to a known-good one; all services were restored by 17:06 UTC.`,`Trigger   : database permission change → query returns duplicates
Amplifier : generated config pushed globally every 5 minutes
Failure   : file exceeded a hard limit → unhandled error → proxy panic → 5xx
Confusion : on/off failures + status page down by coincidence → suspected attack
Fixes     : validate internally generated config like user input, more global kill switches, review error handling`),
 M(`The core engineering lesson Cloudflare drew?`,``,[`Never use databases`,`Treat internally generated configuration like untrusted input — validate size and format before using it`,`Turn off bot management`,`Use a bigger server`],1,`A file your own system creates can still be wrong.`,`Combine validation with staged rollout and a kill switch so a bad config can't reach the whole fleet at once.`),
 M(`Why did the outage flap between failing and working at first?`,``,[`A DDoS was on and off`,`The file was regenerated every five minutes and only some nodes produced the bad version at first`,`Users kept refreshing`,`DNS caching`],1,`Good and bad files alternated until every node produced the bad one.`,`Intermittent symptoms often mean partial rollout or mixed versions — check what changed and where.`),
 M(`Which practice would most limit this kind of blast radius?`,``,[`More logging only`,`Progressive rollout of config with automatic health checks and a fast global kill switch`,`Manual deploys at night`,`Bigger file limits`],1,`Ship config like code: staged, observed, reversible.`,`This links back to canary releases (o6) and GitOps (o8).`)]}
]}
,
aws:{name:`Cloud (AWS)`,lessons:[
{id:'w1',u:`AWS foundations`,title:`IAM: who can do what`,ref:[[`AWS IAM User Guide`,`https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html`],[`IAM policy evaluation logic`,`https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html`]],steps:[
 Lr(`Identities, policies, roles`,`IAM decides who (users, roles) can do which actions on which resources. Policies are JSON documents of Allow/Deny statements. Workloads should use <b>roles</b> — temporary credentials assumed by an EC2 instance, a Lambda, a pod or a CI job — never long-lived access keys in code. Everything is denied by default; an explicit Deny always beats an Allow.`,`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::backup-bucket/*"
  }]
}`),
 M(`An app on EC2 must read from S3. Best practice?`,``,[`Put access keys in a config file`,`Attach an IAM role to the instance (instance profile) with a least-privilege policy`,`Make the bucket public`,`Use the root account`],1,`Roles give short-lived, automatically rotated credentials.`,`The SDK on the instance picks up the role's credentials from the metadata service. Keys in files leak through Git, backups and logs.`),
 M(`One policy allows s3:DeleteObject, another explicitly denies it. Result?`,``,[`Allowed — first match wins`,`Denied — an explicit Deny always wins`,`Depends on policy order`,`Error`],1,`Default deny → explicit Allow grants → any explicit Deny overrides.`,`This is why guardrails such as organisation-level deny policies work: no account-level Allow can bypass them.`),
 F(`Grant the permission`,`"Effect": "___",
"Action": "s3:GetObject"`,[`Allow`,`Permit`,`Grant`,`Yes`],[`Allow`],`Only Allow and Deny are valid effects.`)]},
{id:'w2',u:`AWS foundations`,title:`VPC networking`,ref:[[`Amazon VPC User Guide`,`https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html`],[`Gateway endpoints for Amazon S3`,`https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html`]],steps:[
 Lr(`Subnets, routes, gateways`,`A VPC is your private network (e.g. 10.0.0.0/16). A <b>public</b> subnet has a route to an internet gateway; a <b>private</b> subnet doesn't, so outbound internet goes through a NAT gateway in a public subnet. Security groups are stateful firewalls on instances (allow rules only); network ACLs are stateless rules on subnets (allow and deny, return traffic must be allowed explicitly). A gateway endpoint lets private subnets reach S3 without internet.`,`VPC 10.0.0.0/16
├─ public  10.0.1.0/24  → route 0.0.0.0/0 → Internet Gateway   (ALB, NAT GW)
└─ private 10.0.2.0/24  → route 0.0.0.0/0 → NAT Gateway        (app, DB)
                        → S3 prefix list → Gateway endpoint (no internet needed)`),
 M(`An EC2 instance in a private subnet can't reach S3. Which is NOT a likely cause?`,``,[`No NAT gateway or S3 gateway endpoint in its route table`,`The instance role lacks s3 permissions`,`A bucket or endpoint policy denies it`,`The instance type is too small`],3,`Size doesn't block network access; routing, IAM or policies do.`,`Check in order: route table (NAT or endpoint?), security group/NACL outbound, IAM role permissions, bucket policy and endpoint policy. This is one of the readiness exercises from your career report.`),
 M(`Security group vs network ACL?`,``,[`Same thing`,`SG is stateful at the instance; NACL is stateless at the subnet and supports deny rules`,`NACL is stateful`,`SGs support deny rules`],1,`Stateful means return traffic is allowed automatically.`,`With NACLs you must allow ephemeral return ports yourself — a classic cause of "it connects but never gets a response".`),
 M(`Why use an S3 gateway endpoint instead of NAT for S3 traffic?`,``,[`It's required by S3`,`Traffic stays on the AWS network, no NAT data charges, and you can restrict access with an endpoint policy`,`It makes S3 faster for writes only`,`It encrypts data at rest`],1,`Private, cheaper and more controllable.`,`Gateway endpoints for S3 and DynamoDB carry no hourly charge; NAT gateways charge per GB processed.`)]},
{id:'w3',u:`AWS foundations`,title:`EC2, EBS and S3`,ref:[[`Amazon S3 storage classes`,`https://aws.amazon.com/s3/storage-classes/`],[`S3 Object Lock`,`https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html`]],steps:[
 Lr(`Compute and storage building blocks`,`EC2 is virtual machines; EBS is block storage attached to one instance in one Availability Zone, protected with snapshots stored in S3. S3 is object storage designed for very high durability, with storage classes from Standard to Glacier Deep Archive, lifecycle rules to move data between them, versioning, and Object Lock for WORM retention — the same immutability idea as in your Storage track.`,`EBS volume  → block, one AZ, snapshot to S3 for backup
S3 bucket   → objects, regional, versioning + lifecycle + Object Lock
Object Lock → governance mode (special permission can override)
              compliance mode (nobody, not even root, can delete before expiry)`),
 M(`Ransomware-proof backup copy in S3. Which setting?`,``,[`Versioning only`,`Object Lock in compliance mode with a retention period`,`A public bucket`,`Server-side encryption only`],1,`Compliance mode can't be shortened or removed, even by the root user.`,`Versioning helps recover overwritten objects but versions can still be deleted by an admin; encryption protects confidentiality, not deletion.`),
 M(`An EBS volume is in ap-south-1a. Can an instance in ap-south-1b attach it?`,``,[`Yes, any AZ`,`No — EBS volumes attach within their AZ; restore a snapshot in the other AZ`,`Only with a NAT`,`Only if encrypted`],1,`EBS is zonal; snapshots let you recreate it elsewhere.`,`This matters for DR design: zonal resources need snapshots or replication to survive an AZ loss.`)]},
{id:'w4',u:`Running platforms`,title:`EKS on AWS`,ref:[[`Amazon EKS User Guide`,`https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html`],[`EKS Pod Identity`,`https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html`]],steps:[
 Lr(`Managed Kubernetes`,`With EKS, AWS runs the Kubernetes control plane; you run worker nodes (managed node groups, Karpenter, or Fargate). Pods that call AWS APIs should get their own narrow IAM role — via EKS Pod Identity or IAM roles for service accounts (IRSA) — instead of inheriting the node's broad role. Load balancers and storage come through controllers and CSI drivers (e.g. the EBS CSI driver).`,`eksctl create cluster --name demo --region ap-south-1 --nodes 2
kubectl get nodes
# give one service account an IAM role (Pod Identity association)
aws eks create-pod-identity-association --cluster-name demo \\
  --namespace app --service-account uploader --role-arn arn:aws:iam::111122223333:role/uploader`),
 M(`Why not just give the node IAM role S3 access for one pod that needs it?`,``,[`Nodes can't have roles`,`Every pod on that node would inherit the access — violates least privilege`,`It's slower`,`EKS forbids it`],1,`Per-pod identity limits blast radius.`,`Pod Identity or IRSA scope credentials to one service account in one namespace.`),
 M(`In EKS, who manages the API server and etcd?`,``,[`You`,`AWS`,`Nobody`,`The node group`],1,`The control plane is managed; you still own nodes, add-ons, upgrades scheduling and workloads.`,`Know the shared-responsibility split — it comes up in platform interviews.`)]},
{id:'w5',u:`Running platforms`,title:`CloudWatch, CloudTrail & reliability`,ref:[[`AWS CloudTrail User Guide`,`https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html`],[`AWS Well-Architected — Reliability pillar`,`https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html`]],steps:[
 Lr(`See it, audit it, design for failure`,`CloudWatch collects metrics and logs and fires alarms. CloudTrail records API calls — who did what, when, from where — which is your audit trail during incidents. The Well-Architected Reliability pillar sums up the design habits: spread across Availability Zones, automate recovery, test recovery procedures, and scale horizontally.`,`aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket
aws cloudwatch put-metric-alarm --alarm-name api-5xx --metric-name 5XXError ...`),
 M(`Who deleted the production bucket? Look in…`,``,[`CloudWatch metrics`,`CloudTrail`,`VPC Flow Logs`,`S3 storage lens`],1,`CloudTrail logs the DeleteBucket API call with the identity that made it.`,`Flow logs show network flows, not API identity; CloudWatch metrics show numbers, not who.`),
 M(`Cheapest step toward surviving an Availability Zone failure?`,``,[`Bigger instances`,`Run instances in at least two AZs behind a load balancer, with data replicated`,`More EBS snapshots in the same AZ`,`A second account`],1,`Multi-AZ is the baseline for production.`,`Then test it: an untested failover is like an untested restore.`)]}
]}

};
