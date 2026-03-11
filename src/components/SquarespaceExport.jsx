import { CmsExportPanel } from "./CmsExportPanel";

const SQUARESPACE_CONFIG = {
  key: "squarespace",
  panelTitle: "Publish to Squarespace",
  step1Title: "Open Squarespace",
  step1Instruction: "Open your Squarespace dashboard and create a new blog post.",
  step1BtnLabel: "Open Squarespace",
  step1Url: "https://www.squarespace.com",
  step3Tip: "In Squarespace, add a Code Block and paste the content there — this keeps your headings and formatting intact.",
  step4ImageLabel: "Featured Image",
  step4NoImageMsg: "No hero image was uploaded — you can add one directly in Squarespace.",
  step5Tip: null,
  step6Tip: "Paste this into the URL field in your Squarespace post settings for the best SEO result.",
};

export function SquarespaceExport(props) {
  return <CmsExportPanel cmsConfig={SQUARESPACE_CONFIG} {...props} />;
}
