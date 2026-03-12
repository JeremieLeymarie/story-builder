import { useMaskito } from "@maskito/react";
import { MaskitoOptions } from "@maskito/core";
import {
  maskitoCaretGuard,
  maskitoPostfixPostprocessorGenerator,
} from "@maskito/kit";

const percentMask = {
  mask: /([0-9]{0,3})/,
  postprocessors: [maskitoPostfixPostprocessorGenerator("%")],
  plugins: [
    maskitoCaretGuard((value) => {
      return [0, value.length - 1];
    }),
  ],
} satisfies MaskitoOptions;

export const useProbabilityMask = () => {
  return useMaskito({ options: percentMask });
};
