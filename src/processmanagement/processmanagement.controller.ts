import { Controller, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';
import { MergerEto } from './etos/merger.eto';
import { InputReader } from './inputreader/input-reader';

@Controller('processmanagement')
export class ProcessmanagementController {
  @Post('/isValidInput')
  isValidInput(@Body() inputFile: InputFileEto) {
    const filename: string = inputFile.filename.toLowerCase();

    const validExtensions = ['.nest', '.ts', 'js'];
    for (const extension of validExtensions) {
      if (filename.includes(extension)) {
        return true;
      }
    }
    return false;
  }

  @Post('/tsplugin/getInputModel')
  async getInputModel(@Body() inputFile: InputFileEto) {
    const inputReader: InputReader = new InputReader();
    const model = await inputReader.getInputObjects(inputFile, true);
    console.log(model.input)
    return model.input;
  }

  @Post('/tsplugin/merge')
  merge(@Body() merger: MergerEto) {
    const patchContent: string = merger.patchContent.replace(/\\n/gm, '\n');
    const baseContent: string = merger.baseContent.replace(/\\n/gm, '\n');
    const patchOverrides: boolean = merger.patchOverrides;

    const tsm = require('@devonfw/ts-merger');
    const mergedCode: string = tsm.merge(
      baseContent,
      patchContent,
      patchOverrides,
    );

    return mergedCode;
  }

  @Post('/tsplugin/beautify')
  beautify(@Body() file: InputFileEto) {
    const content: string = file.content.replace(/\\n/gm, '\n');

    const beautify = require('js-beautify');
    const beautifiedCode: string = beautify(content);

    return beautifiedCode;
  }
}
