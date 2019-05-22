export enum SynagogueOption {
  Mikve,
  Parking,
  DisabledAccess,
  Shtiblach
}

export function CreateSynagogueOptions(){
  let options = {};
  Object.keys(SynagogueOption).filter(opt => isNaN(opt as any)).forEach(k => {
    options[k] = false;
  });
  return options;
}

export type SynagogueOptions = {
  [synagogueOption: string]: boolean
}

export function TranslateSynagogueOption(option: SynagogueOption){
  switch (option){
    case SynagogueOption.DisabledAccess:
      return "disabled_access";
    case SynagogueOption.Mikve:
      return "mikve";
    case SynagogueOption.Parking:
      return "parking";
    case SynagogueOption.Shtiblach:
      return "stiebelach";
  }
}
