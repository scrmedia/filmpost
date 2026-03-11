import { CmsExportPanel } from "./CmsExportPanel";

const PIXIESET_CONFIG = {
  key: "pixieset",
  panelTitle: "Publish to Pixieset",
  step1Title: "Open Pixieset",
  step1Instruction: "Open your Pixieset dashboard, go to Website, and create a new blog post.",
  step1BtnLabel: "Open Pixieset",
  step1Url: "https://pixieset.com",
  step3Tip: "In the Pixieset blog editor, add a Custom Code block and paste the content there — this keeps your headings and formatting intact.",
  step4ImageLabel: "Thumbnail Image",
  step4NoImageMsg: "No hero image was uploaded — you can add one directly in Pixieset.",
  step5Tip: "In Pixieset, open Post Settings and paste this into the Description field.",
  step6Tip: "In Pixieset post settings, find the URL field and replace the default slug with this one for the best SEO result.",
};

export function PixiesetExport(props) {
  return <CmsExportPanel cmsConfig={PIXIESET_CONFIG} {...props} />;
}
