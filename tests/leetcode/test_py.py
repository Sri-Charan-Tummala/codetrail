import importlib, sys, json
sys.path.insert(0,'.')
from sols import S
class ListNode:
    def __init__(s,val=0,next=None): s.val=val; s.next=next
class TreeNode:
    def __init__(s,val=0,left=None,right=None): s.val=val; s.left=left; s.right=right
def ll(a):
    d=ListNode(); t=d
    for x in a: t.next=ListNode(x); t=t.next
    return d.next
def la(h):
    o=[]
    while h: o.append(h.val); h=h.next
    return o
def tree(a):
    if not a: return None
    nodes=[TreeNode(x) if x is not None else None for x in a]; kids=nodes[::-1]; root=kids.pop()
    for n in nodes:
        if n:
            if kids: n.left=kids.pop()
            if kids: n.right=kids.pop()
    return root
def load(slug):
    g={'ListNode':ListNode,'TreeNode':TreeNode}; exec(S[slug][2],g); return g
def sol(slug): return load(slug)['Solution']()
fails=[]
def eq(name,got,exp):
    if got!=exp: fails.append((name,got,exp))
eq('two-sum',sol('two-sum').twoSum([2,7,11,15],9),[0,1]); eq('two-sum2',sol('two-sum').twoSum([3,2,4],6),[1,2])
eq('cd',sol('contains-duplicate').containsDuplicate([1,2,3,1]),True); eq('cd2',sol('contains-duplicate').containsDuplicate([1,2,3]),False)
eq('ana',sol('valid-anagram').isAnagram('anagram','nagaram'),True); eq('ana2',sol('valid-anagram').isAnagram('rat','car'),False)
eq('fu',sol('first-unique-character-in-a-string').firstUniqChar('loveleetcode'),2); eq('fu2',sol('first-unique-character-in-a-string').firstUniqChar('aabb'),-1)
eq('roman',sol('roman-to-integer').romanToInt('MCMXCIV'),1994); eq('roman2',sol('roman-to-integer').romanToInt('LVIII'),58)
eq('lcp',sol('longest-common-prefix').longestCommonPrefix(['flower','flow','flight']),'fl'); eq('lcp2',sol('longest-common-prefix').longestCommonPrefix(['dog','racecar','car']),'')
a=[0,1,0,3,12]; sol('move-zeroes').moveZeroes(a); eq('mz',a,[1,3,12,0,0])
eq('pal',sol('valid-palindrome').isPalindrome('A man, a plan, a canal: Panama'),True); eq('pal2',sol('valid-palindrome').isPalindrome('race a car'),False); eq('pal3',sol('valid-palindrome').isPalindrome(' '),True)
eq('stock',sol('best-time-to-buy-and-sell-stock').maxProfit([7,1,5,3,6,4]),5); eq('stock2',sol('best-time-to-buy-and-sell-stock').maxProfit([7,6,4,3,1]),0)
eq('maj',sol('majority-element').majorityElement([2,2,1,1,1,2,2]),2)
eq('ga',sorted(sorted(g) for g in sol('group-anagrams').groupAnagrams(['eat','tea','tan','ate','nat','bat'])),[['ate','eat','tea'],['bat'],['nat','tan']])
eq('topk',sorted(sol('top-k-frequent-elements').topKFrequent([1,1,1,2,2,3],2)),[1,2])
for s,e in [('()[]{}',True),('(]',False),('([)]',False),('{[]}',True),(']',False),('(',False)]: eq('vp'+s,sol('valid-parentheses').isValid(s),e)
m=load('min-stack')['MinStack'](); m.push(-2); m.push(0); m.push(-3); eq('ms1',m.getMin(),-3); m.pop(); eq('ms2',m.top(),0); eq('ms3',m.getMin(),-2)
q=load('implement-queue-using-stacks')['MyQueue'](); q.push(1); q.push(2); eq('q1',q.peek(),1); eq('q2',q.pop(),1); q.push(3); eq('q3',q.pop(),2); eq('q4',q.empty(),False); q.pop(); eq('q5',q.empty(),True)
for p,e in [('/home/','/home'),('/../','/'),('/home//foo/','/home/foo'),('/a/./b/../../c/','/c'),('/.../a/../b/c/../d/./','/.../b/d')]: eq('sp'+p,sol('simplify-path').simplifyPath(p),e)
eq('rpn',sol('evaluate-reverse-polish-notation').evalRPN(['2','1','+','3','*']),9); eq('rpn2',sol('evaluate-reverse-polish-notation').evalRPN(['4','13','5','/','+']),6)
eq('rpn3',sol('evaluate-reverse-polish-notation').evalRPN(['10','6','9','3','+','-11','*','/','*','17','+','5','+']),22)
for s,e in [('abcabcbb',3),('bbbbb',1),('pwwkew',3),('',0),('abba',2)]: eq('lsw'+s,sol('longest-substring-without-repeating-characters').lengthOfLongestSubstring(s),e)
eq('cw',sol('container-with-most-water').maxArea([1,8,6,2,5,4,8,3,7]),49)
eq('pe',sol('product-of-array-except-self').productExceptSelf([1,2,3,4]),[24,12,8,6]); eq('pe2',sol('product-of-array-except-self').productExceptSelf([-1,1,0,-3,3]),[0,0,9,0,0])
eq('3s',sorted(sol('3sum').threeSum([-1,0,1,2,-1,-4])),[[-1,-1,2],[-1,0,1]]); eq('3s2',sol('3sum').threeSum([0,0,0,0]),[[0,0,0]])
c=list('aabbccc'); n=sol('string-compression').compress(c); eq('sc',c[:n],list('a2b2c3'))
c=list('abbbbbbbbbbbb'); n=sol('string-compression').compress(c); eq('sc2',c[:n],list('ab12'))
eq('mi',sol('merge-intervals').merge([[1,3],[2,6],[8,10],[15,18]]),[[1,6],[8,10],[15,18]]); eq('mi2',sol('merge-intervals').merge([[1,4],[4,5]]),[[1,5]])
eq('ii',sol('insert-interval').insert([[1,3],[6,9]],[2,5]),[[1,5],[6,9]]); eq('ii2',sol('insert-interval').insert([[1,2],[3,5],[6,7],[8,10],[12,16]],[4,8]),[[1,2],[3,10],[12,16]]); eq('ii3',sol('insert-interval').insert([],[5,7]),[[5,7]])
eq('bs',sol('binary-search').search([-1,0,3,5,9,12],9),4); eq('bs2',sol('binary-search').search([-1,0,3,5,9,12],2),-1)
for a,t,e in [([4,5,6,7,0,1,2],0,4),([4,5,6,7,0,1,2],3,-1),([1],0,-1),([3,1],1,1),([5,1,3],5,0)]: eq('rs'+str(a)+str(t),sol('search-in-rotated-sorted-array').search(a,t),e)
for a,e in [([3,4,5,1,2],1),([4,5,6,7,0,1,2],0),([11,13,15,17],11),([2,1],1)]: eq('fm'+str(a),sol('find-minimum-in-rotated-sorted-array').findMin(a),e)
eq('rl',la(sol('reverse-linked-list').reverseList(ll([1,2,3,4,5]))),[5,4,3,2,1])
eq('m2',la(sol('merge-two-sorted-lists').mergeTwoLists(ll([1,2,4]),ll([1,3,4]))),[1,1,2,3,4,4])
h=ll([3,2,0,-4]); t=h
while t.next: t=t.next
t.next=h.next; eq('cyc',sol('linked-list-cycle').hasCycle(h),True); eq('cyc2',sol('linked-list-cycle').hasCycle(ll([1,2])),False)
L=load('lru-cache')['LRUCache'](2); L.put(1,1); L.put(2,2); eq('lru1',L.get(1),1); L.put(3,3); eq('lru2',L.get(2),-1); L.put(4,4); eq('lru3',L.get(1),-1); eq('lru4',L.get(3),3); eq('lru5',L.get(4),4)
T=load('time-based-key-value-store')['TimeMap'](); T.set('foo','bar',1); eq('tm1',T.get('foo',1),'bar'); eq('tm2',T.get('foo',3),'bar'); T.set('foo','bar2',4); eq('tm3',T.get('foo',4),'bar2'); eq('tm4',T.get('foo',5),'bar2'); eq('tm5',T.get('foo',0),'')
eq('kth',sol('kth-largest-element-in-an-array').findKthLargest([3,2,1,5,6,4],2),5); eq('kth2',sol('kth-largest-element-in-an-array').findKthLargest([3,2,3,1,2,4,5,5,6],4),4)
eq('ts',sol('task-scheduler').leastInterval(list('AAABBB'),2),8); eq('ts2',sol('task-scheduler').leastInterval(list('ACABDB'),1),6); eq('ts3',sol('task-scheduler').leastInterval(list('AAABBB'),3),10)
eq('dt',sol('daily-temperatures').dailyTemperatures([73,74,75,71,69,72,76,73]),[1,1,4,2,1,1,0,0])
for s,e in [('172.16.254.1','IPv4'),('2001:0db8:85a3:0:0:8A2E:0370:7334','IPv6'),('256.256.256.256','Neither'),('01.1.1.1','Neither'),('1.1.1.','Neither'),('2001:0db8:85a3::8A2E:037j:7334','Neither'),('1e1.4.5.6','Neither')]: eq('ip'+s,sol('validate-ip-address').validIPAddress(s),e)
eq('md',sol('maximum-depth-of-binary-tree').maxDepth(tree([3,9,20,None,None,15,7])),3)
r=sol('invert-binary-tree').invertTree(tree([4,2,7,1,3,6,9])); eq('inv',sol('binary-tree-level-order-traversal').levelOrder(r),[[4],[7,2],[9,6,3,1]])
eq('lo',sol('binary-tree-level-order-traversal').levelOrder(tree([3,9,20,None,None,15,7])),[[3],[9,20],[15,7]]); eq('lo2',sol('binary-tree-level-order-traversal').levelOrder(None),[])
g=[list('11110'),list('11010'),list('11000'),list('00000')]; eq('isl',sol('number-of-islands').numIslands(g),1)
g=[list('11000'),list('11000'),list('00100'),list('00011')]; eq('isl2',sol('number-of-islands').numIslands(g),3)
eq('cs',sol('course-schedule').canFinish(2,[[1,0]]),True); eq('cs2',sol('course-schedule').canFinish(2,[[1,0],[0,1]]),False)
eq('cl',[sol('climbing-stairs').climbStairs(n) for n in (1,2,3,5)],[1,2,3,8])
eq('cc',sol('coin-change').coinChange([1,2,5],11),3); eq('cc2',sol('coin-change').coinChange([2],3),-1); eq('cc3',sol('coin-change').coinChange([1],0),0)
print('python fails:',fails if fails else 'none', '| python problems:', sum(1 for k in S if 'class ' in S[k][2]))
