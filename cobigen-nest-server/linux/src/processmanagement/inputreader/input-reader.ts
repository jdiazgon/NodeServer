import { ModelEto } from './../etos/model.eto';
import { InputFileEto } from '../etos/input-file.eto';
import * as tsm from '@devonfw/ts-merger';

export class InputReader {
  readonly content;

  public async getInputObjects(inputFile:InputFileEto, removeEmptyFields : boolean) {
    const parsedFile = tsm.readFile(inputFile.content);

    // Extending the model
    parsedFile.path = inputFile.filename;
    // identifier and type fields are extended with the entity's type

    // Setting the import dictionary
    var entityModuleMapper: { [id: string] : String; } = {};
    parsedFile.getImports().forEach( (i) => {
        let module = i.getModule();
        i.getNamed().forEach ((name) =>{
            entityModuleMapper[String(name)] = module;
        })
    });

    // Traversing the parsed file object and extending each decorator
    this.traverse(parsedFile,entityModuleMapper);

    if (!removeEmptyFields)
    {
      return new ModelEto(JSON.stringify(parsedFile));
    }

    // Removing the empty fields
    const parsedFileString: string = this.removeEmptyFields(parsedFile)

    return new ModelEto(JSON.stringify(JSON.parse(parsedFileString)));
  }

  private removeEmptyFields(parsedFile): string {
    var regExp = /"\w+":(""|\[\]|{}),?("module":null)?/gi
    var trailingCommasRegExp = /\,(?=\s*?[\}\]])/g;

    let parsedFileString: string = JSON.stringify(parsedFile);

    while (parsedFileString.search(regExp)> -1)
    {
        parsedFileString = parsedFileString.replace(regExp, ""); 
        parsedFileString = parsedFileString.replace(trailingCommasRegExp, "");
    }
    return parsedFileString;
  }


  private traverse(o,entityModuleMapper) {
    for (var i in o) {
        if(o[i] && o[i]!=null){
            if(typeof o[i].getType === 'function'){
                let name = o[i].getType();
                let module = entityModuleMapper[String(name)];
                if (typeof module == 'undefined')
                {
                    module = null;
                }
                o[i].setType(
                    {
                        "name" : name,
                        "module": module
                    }
                );
            }
            if (typeof o[i].getIsCallExpression === 'function'){
              let identifier = o[i].getIdentifier();
              if (identifier != '')
              {
                  o[i].setIdentifier(
                  {
                      "name" : identifier,
                      "module": entityModuleMapper[String(identifier)]
                  }
                  );
              } 
          }
        }
        if (o[i] !== null && typeof(o[i])=="object") {
            //going one step down in the object tree!!
            this.traverse(o[i],entityModuleMapper);
        }

    }
}
}
