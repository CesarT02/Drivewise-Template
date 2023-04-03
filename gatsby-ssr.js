// Import React so that you can use JSX in HeadComponents
// import React from "react";

const HtmlAttributes = {
  lang: "en"
}

const HeadComponents = [
]

const BodyAttributes = {
  className: 'bg-slate-800'
}

exports.onRenderBody = ({
  setHeadComponents,
  setHtmlAttributes,
  setBodyAttributes
}, pluginOptions) => {
  setHtmlAttributes(HtmlAttributes)
  setHeadComponents(HeadComponents)
  setBodyAttributes(BodyAttributes)
}