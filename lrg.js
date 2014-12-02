process.stdout.write(".........................................................\n");
process.stdout.write("Starting LRV...\n");
process.stdout.write(".........................................................\n");

var rg = require('./rg');
rg.execute(
	'.php',
	function(wstream){
		wstream.write('<?php\n');
		wstream.write('\n');
		wstream.write('return array(\n');	
	},
	function(wstream, key, value){
		wstream.write('			');
		wstream.write('"'+key+'" =>');
		wstream.write('"'+value+'",\n');
	},
	function(wstream){
		wstream.write(');\n');
	}
);