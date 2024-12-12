"use strict";(self.webpackChunkverana_doc=self.webpackChunkverana_doc||[]).push([[1828],{9897:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>o,contentTitle:()=>l,default:()=>u,frontMatter:()=>s,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"getting-started/multi-validator","title":"Setting Up Multiple Validators","description":"To create a multi-validator network, follow these steps:","source":"@site/docs/getting-started/multi-validator.md","sourceDirName":"getting-started","slug":"/getting-started/multi-validator","permalink":"/docs/getting-started/multi-validator","draft":false,"unlisted":false,"editUrl":"https://github.com/verana-labs/verana-docs/edit/main/docs/getting-started/multi-validator.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Setting Up the Chain","permalink":"/docs/getting-started/setup-chain"},"next":{"title":"Trust Registry Module","permalink":"/docs/modules/trust-registry"}}');var a=n(4848),i=n(8453);const s={},l="Setting Up Multiple Validators",o={},d=[];function c(t){const e={code:"code",h1:"h1",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...t.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(e.header,{children:(0,a.jsx)(e.h1,{id:"setting-up-multiple-validators",children:"Setting Up Multiple Validators"})}),"\n",(0,a.jsx)(e.p,{children:"To create a multi-validator network, follow these steps:"}),"\n",(0,a.jsxs)(e.ol,{children:["\n",(0,a.jsx)(e.li,{children:"Clean up existing data:"}),"\n"]}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-bash",children:"rm -rf ~/.verana ~/.verana2\n"})}),"\n",(0,a.jsxs)(e.ol,{start:"2",children:["\n",(0,a.jsx)(e.li,{children:"Start the primary validator:"}),"\n"]}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-bash",children:"./scripts/setup_primary_validator.sh\n"})}),"\n",(0,a.jsxs)(e.ol,{start:"3",children:["\n",(0,a.jsx)(e.li,{children:"Start a secondary validator:"}),"\n"]}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-bash",children:"./scripts/setup_additional_validator.sh 2\n"})}),"\n",(0,a.jsx)(e.p,{children:"Now your network has multiple validators running locally. You can use the CLI to interact with either validator by specifying their --node RPC URL."})]})}function u(t={}){const{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,a.jsx)(e,{...t,children:(0,a.jsx)(c,{...t})}):c(t)}},8453:(t,e,n)=>{n.d(e,{R:()=>s,x:()=>l});var r=n(6540);const a={},i=r.createContext(a);function s(t){const e=r.useContext(i);return r.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function l(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(a):t.components||a:s(t.components),r.createElement(i.Provider,{value:e},t.children)}}}]);