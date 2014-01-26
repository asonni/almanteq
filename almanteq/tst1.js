/*
var str = "cbacdb",
	i=0,
	count=1,
	dic={},
	lst = [];


for (i=0;i<str.length;i++){
	if(dic[str[i]]){

	} else {
		dic[str[i]] = count;
		lst.push(str[i]);
		count++;
	}
}*/


function fac(n){
	if(n<=1)
		return 1;
	else {
		var f = fac(n-1),
			sol = f * n;
			return sol;

	}

}

console.log(fac(4));

function reverse(word){
	if (word=="")
		return word;
	else {
		var subWord=reverse(word.substring(1));
			reversedword = subWord + word[0];
			return reversedword;

	}
}

console.log(reverse("ahmed"));