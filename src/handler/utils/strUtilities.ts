export function camelize(str: any){
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word: any, index: any) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function capitalizeFirstLetter(string: any){
  return string.charAt(0).toUpperCase() + string.slice(1);
}