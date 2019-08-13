import { ModelEto } from './../etos/model.eto';
import Decorator from "@devonfw/ts-merger/build/components/decorator/Decorator";
export class InputReader {
  readonly content;

  public async getInputObjects(content: string, removeEmptyFields : boolean) {
    const tsm = require('@devonfw/ts-merger');
    const parsedFile = tsm.readFile(content);

    // Extending the model
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
    this.traverse(parsedFile,this.extendDecorator,entityModuleMapper);

    if (!removeEmptyFields)
    {
      return new ModelEto(JSON.stringify(parsedFile));
    }

    // Removing the empty fields
    var re = /"\w+":(""|\[\]|{}),?("module":null)?/gi
    var trailingCommasRe = /\,(?=\s*?[\}\]])/g;

    const str = JSON.stringify(parsedFile);
    var newstr = str;

    while (newstr.search(re)> -1)
    {
        newstr = newstr.replace(re, ""); 
        newstr = newstr.replace(trailingCommasRe, "");
    }

    return new ModelEto(JSON.stringify(JSON.parse(newstr)));
  }

  private extendDecorator(decorator:Decorator, entityModuleMapper:object)
  {
      let identifier = decorator.getIdentifier();
      if (identifier != '')
      {
          decorator.setIdentifier(
          {
              "name" : identifier,
              "module": entityModuleMapper[String(identifier)]
          }
          );
      }
      
  }

  private traverse(o,func,entityModuleMapper) {
    for (var i in o) {
        if(o[i] && o[i]!=null){
            //console.log(typeof o[i].getIsCallExpression === 'function');
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
              //func.apply(this,[o[i]]); 
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
        if (o[i] !== null && typeof(o[i])=="object" && !(o[i] instanceof Decorator)) {
            //going one step down in the object tree!!
            //console.log("STEP DOWN");
            this.traverse(o[i],func,entityModuleMapper);
        }

    }
}
}
