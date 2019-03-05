import { Controller, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';
import { MergerEto } from './etos/merger.eto';

@Controller('processmanagement')
export class ProcessmanagementController {
  @Post('/isValidInput')
  isValidInput(@Body() inputFile: InputFileEto) {
    const path: string = inputFile.path;
    // console.log(path);
    if (path.includes('.nest')) {
      return true;
    }
    return false;
  }

  @Post('/merge')
  merge(@Body() merger: MergerEto) {
    const patchContent: string = merger.patchContent;
    const baseContent: string = merger.baseContent;
    const patchOverrides: boolean = merger.patchOverrides;

    let tsm = require('@devonfw/ts-merger');
    let mergedCode: string = tsm.merge(
      baseContent,
      patchContent,
      patchOverrides,
    );
    return mergedCode;
  }
}
