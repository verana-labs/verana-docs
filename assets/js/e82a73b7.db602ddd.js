"use strict";(self.webpackChunkverana_doc=self.webpackChunkverana_doc||[]).push([[3896],{6089:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>l,frontMatter:()=>o,metadata:()=>s,toc:()=>u});const s=JSON.parse('{"id":"modules/trust-registry","title":"Trust Registry Module","description":"The Trust Registry module lets you manage governance frameworks.","source":"@site/docs/modules/trust-registry.md","sourceDirName":"modules","slug":"/modules/trust-registry","permalink":"/docs/modules/trust-registry","draft":false,"unlisted":false,"editUrl":"https://github.com/verana-labs/verana-docs/edit/main/docs/modules/trust-registry.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Setting Up Multiple Validators","permalink":"/docs/getting-started/multi-validator"},"next":{"title":"DID Directory Module","permalink":"/docs/modules/did-directory"}}');var n=r(4848),a=r(8453);const o={},i="Trust Registry Module",d={},u=[{value:"Create a Trust Registry",id:"create-a-trust-registry",level:3}];function c(e){const t={code:"code",h1:"h1",h3:"h3",header:"header",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"trust-registry-module",children:"Trust Registry Module"})}),"\n",(0,n.jsx)(t.p,{children:"The Trust Registry module lets you manage governance frameworks."}),"\n",(0,n.jsx)(t.h3,{id:"create-a-trust-registry",children:"Create a Trust Registry"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:'veranad tx trustregistry create-trust-registry \\\n  did:example:123456789abcdefghi \\\n  "http://example.com" \\\n  en \\\n  https://example.com/framework.pdf \\\n  --from user --keyring-backend test --chain-id test-1\n'})}),"\n",(0,n.jsx)(t.p,{children:"Query a Trust Registry"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"veranad q trustregistry get-trust-registry <tr_id> --output json\n"})})]})}function l(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},8453:(e,t,r)=>{r.d(t,{R:()=>o,x:()=>i});var s=r(6540);const n={},a=s.createContext(n);function o(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);