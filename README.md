# CSS_DataVis
Dynamic data visualization with vanilla javascript and CSS

![splashimage] (jwdv.jpg)

Trying to do some dynamic data visualizations with no framework, only plain JS and CSS. 

the html file displays currently displays demos of 3 classes:

jwSPLOT : basic scatter plot. Add data to the plot dynamically with jsSPlot.addpoint(ptX, ptY)

jwRLGraph: a "running" line graph. Approximates "smooth" curves from semi-continuous data. Draws across frame containing it then scrolls as time progresses. 

NOTE: THESE TWO CLASSES CURRENTLY EXPECT DATA NORMALIZED TO BE IN THE INTERVAL (0.0, 1.0). 

jwDistribution: draws an approximate distribution as a bar graph, binning data into an arbitrary number of bins. Recalculates bins and redraws distribution with each data point added. Can accept data in any range, adjusting bin width to accomodate increased range generated by new data. 
