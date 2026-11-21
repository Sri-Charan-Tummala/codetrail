/* Template for js/personal.js (git-ignored). Copy this file to js/personal.js and fill in your own details.
   Everything is optional — the app works without it. */
var CT_PERSONAL={
  pipe:[],            // your job pipeline: [{co,role,url,fit,gap,pri,res,st,next,exp,dl,les:[lessonIds]}]
  pipeAsOf:'',        // date the pipeline was last checked, e.g. '2026-11-16'
  trackerUrl:'',      // link to your job tracker
  resumes:[],         // [[label, url], ...]
  companies:[],       // extra company guides: [{id,name,match,notes:[],focus:[lessonIds],src:[[label,url]]}]
  you:[],             // "Your story" Q&A cards: [[question, your answer], ...]
  beh:[],             // behavioural Q&A cards: [[question, your answer], ...]
  storySeed:{},       // STAR story drafts: {storyId:{s,t,a,r}}
  storySeedOld:{}     // previous drafts (replaced only if you never edited them)
};
