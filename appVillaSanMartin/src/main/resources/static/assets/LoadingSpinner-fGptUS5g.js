import{t as e}from"./jsx-runtime-D_4Ttfal.js";import{t}from"./theme-CAOBsHux.js";var n=e();function r(){return(0,n.jsxs)(`div`,{style:a.wrapper,children:[(0,n.jsx)(`div`,{style:a.spinner}),(0,n.jsx)(`p`,{style:a.text,children:`Cargando...`})]})}var i=`
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;if(typeof document<`u`){let e=document.createElement(`style`);e.textContent=i,document.head.appendChild(e)}var a={wrapper:{display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,padding:`4rem`,gap:`1rem`},spinner:{width:`40px`,height:`40px`,border:`4px solid ${t.colors.border}`,borderTop:`4px solid ${t.colors.primary}`,borderRadius:`50%`,animation:`spin 0.8s linear infinite`},text:{color:t.colors.textMuted,fontSize:t.fontSizes.sm}};export{r as t};