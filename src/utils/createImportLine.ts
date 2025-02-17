const fileNameFormat = (name: string, type: string): string => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  return formattedName + formattedType;
};

const filePathFormat = (name: string, type: string): string => {
  return `${name.toLowerCase()}.${type}`;
};

export const createImportLine = async (type: string, name: string): Promise<string> => {
  const fileName = fileNameFormat(name, type);
  const filePath = filePathFormat(name, type);

  return `import {${fileName}} from "../modules/${filePath}.route";`;
};
