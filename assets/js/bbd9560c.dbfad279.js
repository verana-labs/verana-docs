"use strict";(self.webpackChunkverana_doc=self.webpackChunkverana_doc||[]).push([[7644],{5196:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"governance/proposals","title":"Submitting Proposals","description":"To submit a software upgrade proposal:","source":"@site/docs/governance/proposals.md","sourceDirName":"governance","slug":"/governance/proposals","permalink":"/docs/governance/proposals","draft":false,"unlisted":false,"editUrl":"https://github.com/verana-labs/verana-docs/edit/main/docs/governance/proposals.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Credential Schema Permissions","permalink":"/docs/modules/credential-schema-permissions"},"next":{"title":"Performing Upgrades","permalink":"/docs/governance/upgrades"}}');var o=r(4848),t=r(8453);const a={},i="Submitting Proposals",c={},l=[];function p(e){const n={code:"code",h1:"h1",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"submitting-proposals",children:"Submitting Proposals"})}),"\n",(0,o.jsx)(n.p,{children:"To submit a software upgrade proposal:"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"Prepare the proposal JSON:"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'{\n    "title": "Upgrade to Verana v2.0",\n    "description": "This upgrade introduces new features.",\n    "upgrade_plan": {\n    "name": "v2.0-upgrade",\n    "height": 1234567\n    }\n}\n'})}),"\n",(0,o.jsxs)(n.ol,{start:"2",children:["\n",(0,o.jsx)(n.li,{children:"Submit the proposal:"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'veranad tx gov submit-proposal software-upgrade "v2.0-upgrade" --from user\n'})})]})}function d(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>a,x:()=>i});var s=r(6540);const o={},t=s.createContext(o);function a(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);