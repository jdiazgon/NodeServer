import { Controller, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';
import { FileEto } from './etos/file.eto';
import { MergerEto } from './etos/merger.eto';

import { ModelEto } from './etos/model.eto';
import { InputReader } from './inputreader/input-reader';
import { TypescriptParser } from 'typescript-parser/TypescriptParser';

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

  @Post('/tsplugin/getInputModel')
  async getInputModel(@Body() inputFile: InputFileEto) {
    // const inputReader: InputReader = new InputReader();

    // const model = await inputReader.getInputObjects(inputFile.path);

    const parser = new TypescriptParser();
    const parsedFile = await parser.parseFile(inputFile.path, 'blank');

    console.log(parsedFile);

    const model: ModelEto = new ModelEto(JSON.stringify(parsedFile));

    console.log(model.input);

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
  beautify(@Body() file: FileEto) {
    const content: string = file.content.replace(/\\n/gm, '\n');

    const beautify = require('js-beautify');
    const beautifiedCode: string = beautify(content);

    return beautifiedCode;
  }
}
