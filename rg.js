

module.exports = {
  execute: function (fileExtension, prefixFunc, templateFunc, suffixFunc ) {
	process.stdout.write("Start generating resources...\n");

	var xlsx = require('node-xlsx');
	var fs = require('fs');
	var config = require('config');


	if(!fs.existsSync(config.sourceFile)){
		process.stdout.write('Source file does not exist.\n');
	}
	else {

		var excelFile = xlsx.parse(config.sourceFile); // parses a file
		var outputDir = config.outputDirectory;
		var keyCellIndex = config.keyCellIndex;
		var languageFirstCellIndex = config.languageFirstCellIndex;

		if(!fs.existsSync(outputDir)){
			process.stdout.write('Creating output directory.\n');
			fs.mkdirSync(outputDir);
		}

		for(var sheetIdx = 0; sheetIdx < excelFile.length;sheetIdx++){
			
			var sheet = excelFile[sheetIdx];
			
			var availableLanguages = [];
			for(var cellIdx = languageFirstCellIndex; cellIdx < sheet.data[0].length; ++cellIdx){
				var lang = sheet.data[0][cellIdx];
				availableLanguages.push(
				 { 
					idx : cellIdx,
					language: lang
				 }
				);
				process.stdout.write('Add language ['+lang+'] for current sheet\n');
				
				var langOutputDir = outputDir+lang;
				if(!fs.existsSync(langOutputDir)){
					fs.mkdirSync(langOutputDir);
				}
				
			}
			
			for(var langIdx in availableLanguages){
				process.stdout.write('process language ['+availableLanguages[langIdx].language+']\n');
				
				var filePath = outputDir + availableLanguages[langIdx].language + '/'+sheet.name + fileExtension;
				var wstream = fs.createWriteStream(filePath);
				
				var langCellIdx = availableLanguages[langIdx].idx;
				for(var row = 1; row < sheet.data.length; ++row){
					var key = sheet.data[row][keyCellIndex];
					var txt = sheet.data[row][langCellIdx];
					prefixFunc(wstream);
					if(txt && txt!= null)
					{
						templateFunc(wstream, key, txt)
					}
					suffixFunc(wstream)
				}		
				
				wstream.end();	
			}
		}
	}

	process.stdout.write("Execution completed...\n");

  }
};


