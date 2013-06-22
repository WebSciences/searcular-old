function dedupe(inputArray){
	var bloom = new BloomFilter(32 * 128, 8);
	
	var outputArray = new Array();
	
	for(var i=0;i<inputArray.length;i++){
		if(bloom.test(inputArray[i])){
			;
		}else{
			bloom.add(inputArray[i]);
			outputArray[outputArray.length] = inputArray[i];
		}
	}
	
	return outputArray;
}