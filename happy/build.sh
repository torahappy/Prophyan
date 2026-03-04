pandoc matagaki.eng.md -f markdown -t html -c css.new.css -s -o matagaki.eng.html --metadata title="tora's Works" --include-in-header=script.html
cp matagaki.eng.html index.html

pandoc matagaki.jp.md -f markdown -t html  -c css.new.css -s -o matagaki.jp.html --metadata title="tora's Works" --include-in-header=script.html
cp matagaki.jp.html index.jp.html

prettier -w index.html
prettier -w index.jp.html


