#!/bin/bash

tail -n0 -f $1 | \
while read line
do
	result=( $(echo $line | awk 'BEGIN {FS="#|,| |\t"}; /produce_block/ {print $11, $18}') )
	if [ ${#result[@]} -eq 2 ] && [ ${result[1]} -gt 0 ]
	then
		echo "${result[0]}"
	fi
done
