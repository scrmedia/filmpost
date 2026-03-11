import { CmsExportPanel } from "./CmsExportPanel";

const WIX_CONFIG = {
  key: "wix",
  panelTitle: "Publish to Wix",
  step1Title: "Open Wix",
  step1Instruction: "Open your Wix dashboard and go to Blog, then click New Post.",
  step1BtnLabel: "Open Wix",
  step1Url: "https://manage.wix.com",
  step3Tip: "In the Wix Blog editor, click the plus icon to add an HTML embed block, then paste the content there — this preserves your headings and formatting correctly.",
  step4ImageLabel: "Cover Image",
  step4NoImageMsg: "No hero image was uploaded — you can add one directly in Wix.",
  step5Tip: "In Wix, find the SEO settings for your post and paste this into the Meta Description field.",
  step6Tip: "In Wix post settings, find the Post URL field and replace the default slug with this one for the best SEO result.",
};

export function WixExport(props) {
  return <CmsExportPanel cmsConfig={WIX_CONFIG} {...props} />;
}
