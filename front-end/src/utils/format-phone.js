export default function formatPhone(num){
  if(num.value.length === 4){
    num.value = num.value.replace(
      /(\d)(\d)(\d)(\d)/,
      "$1$2$3-$4"
    );
  };
  if(num.value.length === 8){
    num.value = num.value.replace(
      /(\d)(\d)(\d)([-])(\d)(\d)(\d)(\d)/,
      "$1$2$3-$5$6$7-$8"
    );
  }
  
}
