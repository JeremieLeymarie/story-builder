import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import { validateUrl } from "@/design-system/components/editor/utils/url";

export const LinkPlugin = () => {
  return <LexicalLinkPlugin validateUrl={validateUrl} />;
};
