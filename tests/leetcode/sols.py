# slug -> (approach, complexity, code). Code is LeetCode-style Python.
S = {}
def add(slug, approach, cx, code): S[slug] = (approach, cx, code.strip('\n'))

add('two-sum', 'One pass with a dict of value → index; for each number check whether target − number was already seen.', 'O(n) time, O(n) space', '''
class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
''')
add('contains-duplicate', 'A set removes duplicates, so compare lengths (or stop at the first repeat).', 'O(n) time, O(n) space', '''
class Solution:
    def containsDuplicate(self, nums):
        return len(set(nums)) != len(nums)
''')
add('valid-anagram', 'Two strings are anagrams when every character appears the same number of times.', 'O(n) time, O(1) space (bounded alphabet)', '''
from collections import Counter

class Solution:
    def isAnagram(self, s, t):
        return len(s) == len(t) and Counter(s) == Counter(t)
''')
add('first-unique-character-in-a-string', 'Count characters, then scan again and return the first index whose count is 1.', 'O(n) time, O(1) space', '''
from collections import Counter

class Solution:
    def firstUniqChar(self, s):
        count = Counter(s)
        for i, ch in enumerate(s):
            if count[ch] == 1:
                return i
        return -1
''')
add('roman-to-integer', 'Add each value, but subtract it when a larger value follows (IV, IX, XL…).', 'O(n) time, O(1) space', '''
class Solution:
    def romanToInt(self, s):
        v = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        total = 0
        for i, ch in enumerate(s):
            if i + 1 < len(s) and v[ch] < v[s[i + 1]]:
                total -= v[ch]
            else:
                total += v[ch]
        return total
''')
add('longest-common-prefix', 'Compare the lexicographically smallest and largest strings; their common prefix is everyone\'s.', 'O(n·m) time, O(1) extra space', '''
class Solution:
    def longestCommonPrefix(self, strs):
        if not strs:
            return ""
        a, b = min(strs), max(strs)
        i = 0
        while i < len(a) and a[i] == b[i]:
            i += 1
        return a[:i]
''')
add('move-zeroes', 'Keep a write pointer: copy each non-zero forward by swapping, so zeros drift to the end in place.', 'O(n) time, O(1) space', '''
class Solution:
    def moveZeroes(self, nums):
        w = 0
        for r in range(len(nums)):
            if nums[r] != 0:
                nums[w], nums[r] = nums[r], nums[w]
                w += 1
''')
add('valid-palindrome', 'Two pointers from both ends, skipping non-alphanumeric characters and comparing lower-case.', 'O(n) time, O(1) space', '''
class Solution:
    def isPalindrome(self, s):
        i, j = 0, len(s) - 1
        while i < j:
            if not s[i].isalnum():
                i += 1
            elif not s[j].isalnum():
                j -= 1
            else:
                if s[i].lower() != s[j].lower():
                    return False
                i += 1
                j -= 1
        return True
''')
add('best-time-to-buy-and-sell-stock', 'Track the lowest price so far; the best profit is the max of price − lowest.', 'O(n) time, O(1) space', '''
class Solution:
    def maxProfit(self, prices):
        lowest, best = float("inf"), 0
        for p in prices:
            lowest = min(lowest, p)
            best = max(best, p - lowest)
        return best
''')
add('majority-element', 'Boyer–Moore voting: keep a candidate and a count; the majority survives the cancellations.', 'O(n) time, O(1) space', '''
class Solution:
    def majorityElement(self, nums):
        cand, count = None, 0
        for x in nums:
            if count == 0:
                cand = x
            count += 1 if x == cand else -1
        return cand
''')
add('group-anagrams', 'Anagrams share the same sorted letters; group by that key in a dict of lists.', 'O(n·k log k) time, O(n·k) space', '''
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for s in strs:
            groups["".join(sorted(s))].append(s)
        return list(groups.values())
''')
add('top-k-frequent-elements', 'Count with Counter, then take the k most common (a heap underneath).', 'O(n log k) time, O(n) space', '''
from collections import Counter

class Solution:
    def topKFrequent(self, nums, k):
        return [x for x, _ in Counter(nums).most_common(k)]
''')
add('valid-parentheses', 'Push openers on a stack; each closer must match the top.', 'O(n) time, O(n) space', '''
class Solution:
    def isValid(self, s):
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for ch in s:
            if ch in pairs:
                if not stack or stack.pop() != pairs[ch]:
                    return False
            else:
                stack.append(ch)
        return not stack
''')
add('min-stack', 'Store (value, current minimum) pairs so getMin is the top\'s second item.', 'O(1) per operation, O(n) space', '''
class MinStack:
    def __init__(self):
        self.st = []

    def push(self, val):
        m = min(val, self.st[-1][1]) if self.st else val
        self.st.append((val, m))

    def pop(self):
        self.st.pop()

    def top(self):
        return self.st[-1][0]

    def getMin(self):
        return self.st[-1][1]
''')
add('implement-queue-using-stacks', 'Push onto an in-stack; when popping, refill the out-stack only when it\'s empty (amortised O(1)).', 'Amortised O(1) per operation', '''
class MyQueue:
    def __init__(self):
        self.inn, self.out = [], []

    def push(self, x):
        self.inn.append(x)

    def _move(self):
        if not self.out:
            while self.inn:
                self.out.append(self.inn.pop())

    def pop(self):
        self._move()
        return self.out.pop()

    def peek(self):
        self._move()
        return self.out[-1]

    def empty(self):
        return not self.inn and not self.out
''')
add('simplify-path', 'Split on "/", use a stack: skip "" and ".", pop on "..", push names. Join with "/".', 'O(n) time, O(n) space', '''
class Solution:
    def simplifyPath(self, path):
        stack = []
        for part in path.split("/"):
            if part == "..":
                if stack:
                    stack.pop()
            elif part and part != ".":
                stack.append(part)
        return "/" + "/".join(stack)
''')
add('evaluate-reverse-polish-notation', 'Stack of numbers; on an operator pop two, apply, push. Division truncates toward zero.', 'O(n) time, O(n) space', '''
class Solution:
    def evalRPN(self, tokens):
        st = []
        for t in tokens:
            if t in "+-*/":
                b, a = st.pop(), st.pop()
                if t == "+": st.append(a + b)
                elif t == "-": st.append(a - b)
                elif t == "*": st.append(a * b)
                else: st.append(int(a / b))
            else:
                st.append(int(t))
        return st[0]
''')
add('longest-substring-without-repeating-characters', 'Sliding window: remember each character\'s last index; when it repeats inside the window, move the left edge past it.', 'O(n) time, O(min(n, alphabet)) space', '''
class Solution:
    def lengthOfLongestSubstring(self, s):
        last, left, best = {}, 0, 0
        for right, ch in enumerate(s):
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left + 1)
        return best
''')
add('container-with-most-water', 'Two pointers at the ends; area is limited by the shorter wall, so move that pointer inward.', 'O(n) time, O(1) space', '''
class Solution:
    def maxArea(self, height):
        i, j, best = 0, len(height) - 1, 0
        while i < j:
            best = max(best, (j - i) * min(height[i], height[j]))
            if height[i] < height[j]:
                i += 1
            else:
                j -= 1
        return best
''')
add('product-of-array-except-self', 'Fill the answer with prefix products left to right, then multiply in suffix products right to left. No division.', 'O(n) time, O(1) extra space (output excluded)', '''
class Solution:
    def productExceptSelf(self, nums):
        n = len(nums)
        out = [1] * n
        p = 1
        for i in range(n):
            out[i] = p
            p *= nums[i]
        s = 1
        for i in range(n - 1, -1, -1):
            out[i] *= s
            s *= nums[i]
        return out
''')
add('3sum', 'Sort; fix each number, then two pointers find pairs summing to its negative. Skip duplicates at every level.', 'O(n²) time, O(1) extra space (excluding sort)', '''
class Solution:
    def threeSum(self, nums):
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                s = nums[i] + nums[lo] + nums[hi]
                if s < 0:
                    lo += 1
                elif s > 0:
                    hi -= 1
                else:
                    res.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
        return res
''')
add('string-compression', 'Read pointer walks each run; write the character and, if the run is longer than 1, its count digits. Return the write length.', 'O(n) time, O(1) space', '''
class Solution:
    def compress(self, chars):
        w = r = 0
        while r < len(chars):
            ch, start = chars[r], r
            while r < len(chars) and chars[r] == ch:
                r += 1
            chars[w] = ch
            w += 1
            if r - start > 1:
                for d in str(r - start):
                    chars[w] = d
                    w += 1
        return w
''')
add('merge-intervals', 'Sort by start; extend the last merged interval when the next overlaps, otherwise append.', 'O(n log n) time, O(n) space', '''
class Solution:
    def merge(self, intervals):
        intervals.sort(key=lambda x: x[0])
        out = []
        for s, e in intervals:
            if out and s <= out[-1][1]:
                out[-1][1] = max(out[-1][1], e)
            else:
                out.append([s, e])
        return out
''')
add('insert-interval', 'Three phases: copy intervals ending before the new one, merge all that overlap it, copy the rest.', 'O(n) time, O(n) space', '''
class Solution:
    def insert(self, intervals, newInterval):
        out, i, n = [], 0, len(intervals)
        s, e = newInterval
        while i < n and intervals[i][1] < s:
            out.append(intervals[i]); i += 1
        while i < n and intervals[i][0] <= e:
            s = min(s, intervals[i][0]); e = max(e, intervals[i][1]); i += 1
        out.append([s, e])
        out.extend(intervals[i:])
        return out
''')
add('binary-search', 'Classic lo/hi loop on a sorted array; halve the range each step.', 'O(log n) time, O(1) space', '''
class Solution:
    def search(self, nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1
''')
add('search-in-rotated-sorted-array', 'Binary search; one half is always sorted. If the target is inside the sorted half, search there, otherwise the other half.', 'O(log n) time, O(1) space', '''
class Solution:
    def search(self, nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:            # left half sorted
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:                                 # right half sorted
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1
''')
add('find-minimum-in-rotated-sorted-array', 'Binary search comparing mid with the right end: if mid > right, the minimum is to the right, otherwise at mid or left.', 'O(log n) time, O(1) space', '''
class Solution:
    def findMin(self, nums):
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]
''')
add('reverse-linked-list', 'Walk the list, pointing each node back to the previous one.', 'O(n) time, O(1) space', '''
class Solution:
    def reverseList(self, head):
        prev = None
        while head:
            head.next, prev, head = prev, head, head.next
        return prev
''')
add('merge-two-sorted-lists', 'Dummy head; repeatedly attach the smaller node, then attach whatever remains.', 'O(n + m) time, O(1) space', '''
class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next
''')
add('linked-list-cycle', 'Floyd\'s fast/slow pointers: if there\'s a cycle the fast one laps the slow one.', 'O(n) time, O(1) space', '''
class Solution:
    def hasCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                return True
        return False
''')
add('lru-cache', 'OrderedDict keeps usage order: move a key to the end on every get/put; evict from the front when over capacity.', 'O(1) per operation, O(capacity) space', '''
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.d = OrderedDict()

    def get(self, key):
        if key not in self.d:
            return -1
        self.d.move_to_end(key)
        return self.d[key]

    def put(self, key, value):
        if key in self.d:
            self.d.move_to_end(key)
        self.d[key] = value
        if len(self.d) > self.cap:
            self.d.popitem(last=False)
''')
add('time-based-key-value-store', 'Timestamps arrive increasing, so each key keeps an appended list; get() binary-searches for the latest timestamp ≤ the asked one.', 'set O(1), get O(log n)', '''
import bisect
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.times = defaultdict(list)
        self.vals = defaultdict(list)

    def set(self, key, value, timestamp):
        self.times[key].append(timestamp)
        self.vals[key].append(value)

    def get(self, key, timestamp):
        i = bisect.bisect_right(self.times[key], timestamp)
        return self.vals[key][i - 1] if i else ""
''')
add('kth-largest-element-in-an-array', 'Keep a min-heap of size k; its top is the kth largest.', 'O(n log k) time, O(k) space', '''
import heapq

class Solution:
    def findKthLargest(self, nums, k):
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]
''')
add('task-scheduler', 'The most frequent task sets the frame: (maxCount − 1) gaps of size n+1, plus one slot per task tied for the max. The answer is at least the number of tasks.', 'O(n) time, O(1) space', '''
from collections import Counter

class Solution:
    def leastInterval(self, tasks, n):
        counts = Counter(tasks).values()
        mx = max(counts)
        tied = sum(1 for c in counts if c == mx)
        return max(len(tasks), (mx - 1) * (n + 1) + tied)
''')
add('daily-temperatures', 'Monotonic stack of indices waiting for a warmer day; pop and answer them when a warmer temperature arrives.', 'O(n) time, O(n) space', '''
class Solution:
    def dailyTemperatures(self, temperatures):
        ans = [0] * len(temperatures)
        stack = []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)
        return ans
''')
add('validate-ip-address', 'Check IPv4 (4 decimal parts 0–255, no leading zeros) and IPv6 (8 hex groups of 1–4 digits) separately.', 'O(n) time, O(1) space', '''
class Solution:
    def validIPAddress(self, queryIP):
        def v4(s):
            parts = s.split(".")
            return len(parts) == 4 and all(
                p.isdigit() and p.isascii() and str(int(p)) == p and int(p) <= 255 for p in parts)

        def v6(s):
            parts = s.split(":")
            hexd = set("0123456789abcdefABCDEF")
            return len(parts) == 8 and all(1 <= len(p) <= 4 and set(p) <= hexd for p in parts)

        if v4(queryIP):
            return "IPv4"
        if v6(queryIP):
            return "IPv6"
        return "Neither"
''')
add('maximum-depth-of-binary-tree', 'Depth is 1 + the deeper of the two subtrees (recursive DFS).', 'O(n) time, O(h) space', '''
class Solution:
    def maxDepth(self, root):
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
''')
add('invert-binary-tree', 'Swap left and right at every node, recursively.', 'O(n) time, O(h) space', '''
class Solution:
    def invertTree(self, root):
        if root:
            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
''')
add('binary-tree-level-order-traversal', 'BFS with a queue, processing one level (the current queue length) at a time.', 'O(n) time, O(n) space', '''
from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        out, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            out.append(level)
        return out
''')
add('number-of-islands', 'Scan the grid; each unvisited "1" starts a new island, and an iterative DFS sinks the whole island.', 'O(rows·cols) time and space', '''
class Solution:
    def numIslands(self, grid):
        rows, cols = len(grid), len(grid[0])
        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1":
                    count += 1
                    stack = [(r, c)]
                    grid[r][c] = "0"
                    while stack:
                        i, j = stack.pop()
                        for a, b in ((i+1, j), (i-1, j), (i, j+1), (i, j-1)):
                            if 0 <= a < rows and 0 <= b < cols and grid[a][b] == "1":
                                grid[a][b] = "0"
                                stack.append((a, b))
        return count
''')
add('course-schedule', 'Topological sort (Kahn): count prerequisites per course, start from those with none, and see if every course gets taken. A cycle leaves courses behind.', 'O(V + E) time and space', '''
from collections import deque

class Solution:
    def canFinish(self, numCourses, prerequisites):
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for course, pre in prerequisites:
            graph[pre].append(course)
            indeg[course] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        taken = 0
        while q:
            c = q.popleft()
            taken += 1
            for nxt in graph[c]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    q.append(nxt)
        return taken == numCourses
''')
add('climbing-stairs', 'Ways(n) = Ways(n−1) + Ways(n−2), a Fibonacci sequence; keep only the last two values.', 'O(n) time, O(1) space', '''
class Solution:
    def climbStairs(self, n):
        a, b = 1, 1
        for _ in range(n):
            a, b = b, a + b
        return a
''')
add('coin-change', 'Bottom-up DP: dp[x] = fewest coins for amount x = 1 + min(dp[x − coin]).', 'O(amount × coins) time, O(amount) space', '''
class Solution:
    def coinChange(self, coins, amount):
        INF = amount + 1
        dp = [0] + [INF] * amount
        for x in range(1, amount + 1):
            for c in coins:
                if c <= x and dp[x - c] + 1 < dp[x]:
                    dp[x] = dp[x - c] + 1
        return dp[amount] if dp[amount] != INF else -1
''')
# Bash
add('word-frequency', 'Split into one word per line, count with sort | uniq -c, sort by count descending, print "word count".', 'O(n log n)', '''
tr -s ' \\n' '\\n' < words.txt | grep -v '^$' | sort | uniq -c | sort -rn | awk '{print $2, $1}'
''')
add('tenth-line', 'Print only line 10; prints nothing if the file is shorter.', 'O(n)', '''
sed -n '10p' file.txt
# or: awk 'NR == 10' file.txt
''')
add('valid-phone-numbers', 'Anchored extended regex for the two allowed formats.', 'O(n)', '''
grep -E '^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$' file.txt
''')
add('transpose-file', 'awk collects column i of every row into out[i], then prints each out[i] as a line.', 'O(rows × cols)', '''
awk '{
  for (i = 1; i <= NF; i++) out[i] = (NR == 1 ? $i : out[i] " " $i)
}
END { for (i = 1; i <= NF; i++) print out[i] }' file.txt
''')
# SQL (MySQL syntax, as LeetCode runs it)
add('combine-two-tables', 'LEFT JOIN keeps every person even without an address (address columns become NULL).', '', '''
SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a ON a.personId = p.personId;
''')
add('second-highest-salary', 'Distinct salaries, sorted descending, skip one. Wrapping in a SELECT returns NULL when there is no second salary.', '', '''
SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
''')
add('duplicate-emails', 'Group by email and keep groups with more than one row.', '', '''
SELECT email AS Email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
''')
add('customers-who-never-order', 'Anti-join: LEFT JOIN orders and keep customers with no matching order.', '', '''
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON o.customerId = c.id
WHERE o.id IS NULL;
''')
add('department-highest-salary', 'Join departments, then keep rows whose salary equals that department\'s max (ties included).', '', '''
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON d.id = e.departmentId
WHERE (e.departmentId, e.salary) IN (
  SELECT departmentId, MAX(salary)
  FROM Employee
  GROUP BY departmentId
);
''')
add('rising-temperature', 'Self-join each day to the day before (DATEDIFF = 1) and keep warmer days.', '', '''
SELECT w.id
FROM Weather w
JOIN Weather y ON DATEDIFF(w.recordDate, y.recordDate) = 1
WHERE w.temperature > y.temperature;
''')
