import { Controller, Get, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';
import { MergerEto } from './etos/merger.eto';
import { InputReader } from './inputreader/input-reader';
import * as tsm from '@devonfw/ts-merger';

const config = require('../../package.json');

@Controller('processmanagement')
export class ProcessmanagementController {
  @Get('tsplugin/isConnectionReady')
  isConnectionReady() {
    return config.version;
  }

  @Post('tsplugin/isValidInput')
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

    return model.input;
  }

  @Post('/tsplugin/merge')
  merge(@Body() merger: MergerEto) {
    const patchContent: string = merger.patchContent.replace(/\\n/gm, '\n');
    const baseContent: string = merger.baseContent.replace(/\\n/gm, '\n');
    const patchOverrides: boolean = merger.patchOverrides;

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
