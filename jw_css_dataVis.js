class jwSPlot { 
    constructor(width, height, the_top, the_left, unique_id, parent_container) {
        
        //first 4 arguments used for dimensions/position of scatter plot

        this.width = width; //width of div containing scatter
        this.height = height; //height of div containing scatter
        this.top = the_top; 
        this.left = the_left; 
        
        this.id = unique_id; //when div created, this will be id
        
        
        this.container = document.createElement("div"); 
        this.container.id =  this.id; 
        this.container.className = "scatter_plot"; 

        this.ptD = 6; //point dimension will be 6x6 square

        this.container.setAttribute('style', `width: ${this.width}px; height: ${this.height}px; top: ${this.top}px; left: ${this.left}px`); 
        this.points = new Array(); //store array of points
        this.parent = document.getElementById(parent_container); 
        this.parent.appendChild(this.container); 
    }

    //currently expects normalized points in [0, 1] X [0, 1]
    addpoint(ptX, ptY) {
        let newpoint = document.createElement("div");
        let X = Math.floor(ptX*this.width) - (this.ptD/2); 
        let Y = Math.floor(ptY*this.height) - (this.ptD/2);  
        newpoint.setAttribute('style', `position: absolute; background: blue; top: ${Y}px; left: ${X}px; height: ${this.ptD}; width: ${this.ptD}; opacity: .5;`) ; 
        this.points.push(newpoint); 
        this.container.appendChild(newpoint); 


    }

}


//Class for a "Running" Line Graph. 
class jwRLGraph { 

    constructor(width, height, the_top, the_left, unique_id, parent_container) {
               //first 4 arguments used for dimensions/position of scatter plot

        this.width = width; //width of div containing scatter
        this.height = height; //height of div containing scatter
        this.top = the_top; 
        this.left = the_left; 
        
        this.barWidth = 4; //point dimension will be 5x5
        
        this.container = document.createElement("div"); 
        this.container.id =  unique_id; 
        this.container.className = "rlgraph"; 
        this.container.setAttribute('style',`width: ${this.width}; height: ${this.height}; top: ${this.top}px; left: ${this.left}px; `); 
        
        
        //buffer length determines how many values to store until line graph starts 
        //"scrolling"
        this.bufferLength = Math.floor(this.width/this.barWidth); 
        this.data = new Array();  //store data values
        this.bars = new Array();  //store nodes representing data values. 

        this.parent = document.getElementById(parent_container); 
        this.parent.appendChild(this.container); 
    }


    //currently expects normalized data in range (0.0 to 1.0) 
    addData(theDatum) {
       
            var newbar = document.createElement("div");
            let barheight = theDatum*(this.height); //calculates height of bar as percentage of graph height
            //adjust this math here if you're data is not normalized.... 

            let bartop = this.height-barheight; 
            let barleft = this.barWidth*this.data.length; 


            newbar.setAttribute('style', `position: absolute; top: ${bartop}px; left: ${barleft}px; height: ${barheight}; width: ${this.barWidth};`); 
            
            newbar.classList = "RLGbar"; 
            // newbar.onmouseover = "background = #000000"
            //this.bars.push(newbar); 
            if (this.data.length < this.bufferLength) {
            
                this.container.appendChild(newbar); 
                
                this.bars.push(newbar)
                this.data.push(theDatum); 
            }

            else { //remove the first data point, add the new datapoint, and shift the graph over. 
                
                //grab the first bar/node and shift array down
                var to_discard = this.bars.shift(); 
                
                //shift data array down
                this.data.shift(); 
                this.container.removeChild(to_discard); 

                this.container.appendChild(newbar); 
                this.bars.push(newbar); 
                this.data.push(theDatum); 
                for (i = 0; i < this.data.length; i++ ) {
                    this.bars[i].style.left = i*(this.barWidth); 
                }
            }
    }   

        




}


class jwDistribution { 
    constructor(width, height, the_top, the_left, unique_id, parent_container) {
        //first 4 arguments used for dimensions/position of scatter plot

        this.width = width; //width of div containing scatter
        this.height = height; //height of div containing scatter
        this.top = the_top; 
        this.left = the_left; 
    

        this.id = unique_id //when div created, this will be id
        this.barWidth = this.width; //point dimension will be 5x5
        
        this.jwcontainer = document.createElement("div"); 
        this.jwcontainer.id =  this.id; 
        
        this.jwcontainer.setAttribute('style',`width: ${this.width}; height: ${this.height}; top: ${this.top}px; left: ${this.left}px; `);
        this.jwcontainer.className ="distribution"; 
       
        this.dist_data = document.createElement("div"); 
        this.dist_data.className = "dist_data"; 
        this.dist_data.innerHTML = "MEAN:<br>VARIANCE: "; 
        this.jwcontainer.appendChild(this.dist_data);         

        this.bar_data = document.createElement("div"); 
        this.bar_data.className = "bar_data"; 
        this.bar_data.innerHTML = ""; 
        this.jwcontainer.appendChild(this.bar_data);   

        this.bars = new Array(); //store array of points
        this.data = new Array(); //store data points
        
        //dummy values to initialize range of data 
        //range of data auto-updates as new data points are added
        this.lowbar = null; 
        this.highbar = null; 
        this.graphrange = 100; 
        this.num_bins = 10;  

        this.parent = document.getElementById(parent_container); 
        this.parent.appendChild(this.jwcontainer); 

        this.drawBars = this.drawBars.bind(this); 


         
    }

    //add new data to adjust the distribution
    addData(thedatalist) {
        
        for (i = 0; i < thedatalist.length ; i++) {
            //add new data points to the storage array

            this.data.push(thedatalist[i]); 

            //initialize low and high values if that hasn't happened. 
            if (this.highbar == null) {
                this.highbar = thedatalist[i]; 
            }

            if (this.lowbar == null) {
                this.lowbar = thedatalist[i]; 
            }


            //recalculate/update the range of the distribution if the new data extends it. 
            if (thedatalist[i] > this.highbar) {
                this.highbar = thedatalist[i];
                
                this.graphrange = this.highbar -this.lowbar; 
            }

            if (thedatalist[i] < this.lowbar) {
                this.lowbar = thedatalist[i]; 
                this.graphrange = this.highbar -this.lowbar;
            }
        }
        // console.log(this.data); 

    }




    //expects values in the list to be a percentage (ie, in [0.0, 1.0])
    //this is called in next method, where it's given a distribution on 
    //approximated by the number of bins specified. 

    drawBars(listofValues) {
       
        this.barWidth = Math.floor(this.width/(this.num_bins))
        // console.log(this.barWidth); 
        for (i = 0; i < listofValues.length; i++) {
            var newbar = document.createElement("div");
            let barheight = listofValues[i]*(this.height); 
            let bartop = Math.floor(this.height*(1-listofValues[i])); 
            let barleft = i*this.barWidth; 
            let barright = barleft+this.barWidth; 
            let thepercentage = (listofValues[i]*100).toFixed(2); 
            let barlow = this.lowbar + i*(this.graphrange/this.num_bins); 
            let barhigh = (barlow + (this.graphrange/this.num_bins)).toFixed(2); 

            newbar.style=`position: absolute; top: ${bartop}px; left: ${barleft}px; height: ${barheight}; width: ${this.barWidth}; opacity: .25;` ; 
            newbar.classList = "bar"; 
            newbar.onmouseenter = function() {
                newbar.parentNode.childNodes[1].innerHTML = `${thepercentage}% OF DATA BETWEEN<br> ${barlow} and ${barhigh}`; 
            }
            newbar.onmouseleave = function() {
                newbar.parentNode.childNodes[1].innerHTML = ""; 

            }
            // newbar.onmouseover = "background = #000000"
            this.bars.push(newbar); 

            // var ro_info = document.createElement("div");
            // ro_info.className = "ro_info_bar"; 
            // newbar.appendChild(ro_info); 


            this.jwcontainer.appendChild(newbar); 
            // this.jwcontainer.removeChild(newbar); 
        }

    }


    //method to generate distribution (or a discrete apprimation of one)
    //binning the data into the number of bins specified as an argument. 
    //Calculates the distribution and then draws the bars to visualize it. 
    update_distribution(num_bins) {
        this.num_bins = num_bins; 
        //first clear out the old bars:
        for (i = 0; i < this.bars.length; i++) {
            this.jwcontainer.removeChild(this.bars[i]); 
        }
        
        //re-initialize array of bars. 
        this.bars = new Array(); 
        //could do this more efficiently to scale up....
        // var oldbars = document.getElementsByClassName('bar');

        // while (oldbars[0] != null) {
        //     oldbars[0].parentNode.removeChild(oldbars[0]); 
        // }

        if (this.data.length > 0 ) {
            let denom = this.data.length; 
            
            //decide how to bin data values based on the range and the number of bars you want
            let binwidth = (this.graphrange/num_bins); 
            // console.log(`binwidth: ${binwidth}`); 
            // console.log(`low: ${this.lowbar}`); 
            // console.log(`high: ${this.highbar}`); 
            
            let barheights = new Array(); 

            //make an array to store entry for each bar height
            //and are calculated as the number of values in a given bin over the total number
            //of values recorded

            //first, initialize each bin at zero
            for (i = 0; i < num_bins; i++) {
                barheights.push(0); 
            }

            // increment the right bar count based on data value. 
            for (var i = 0; i < this.data.length; i++) {
                // console.log(`trying to bin ${this.data[i]}`); 
                for (var j = 0; j < num_bins; j++) {
                    
                    if (this.data[i]- this.lowbar - (j*binwidth) < binwidth) {
                        //increment the bar height if 
                        barheights[j]+=1
                        // console.log(`${this.data[i]} is in bin ${j}`)
                        break; 
                    } 
                }


            }

            //normalize the bar heights by making them a percentage 
            //(divide their counts by number of points currently in dataset)
            for (i= 0; i< barheights.length; i++) {
                //taking cube root of bar height in order to make graph a bit more visually dynamic 
                //ie, exaggerate differences between small variations. 
                barheights[i] = Math.cbrt(barheights[i]/denom); 
            }
            // console.log(barheights)
            this.drawBars(barheights); 
            
        }

        




    }

    getMoments() {
        var the_mean; 
        the_mean = 0; 
        for (i = 0; i < this.data.length; i++) {
            the_mean += this.data[i]; 
        }
        the_mean = the_mean/this.data.length; 

        var the_variance; 
        the_variance = 0; 

        for (i = 0; i < this.data.length; i++) {
            the_variance += Math.pow((the_mean - this.data[i]), 2); 
        }

        the_variance = the_variance/this.data.length; 
        this.dist_data.innerHTML = `MEAN: ${the_mean.toFixed(3)}<br>VARIANCE: ${the_variance.toFixed(3)}`
        return [the_mean, the_variance]; 

    }



}




///////////////EXAMPLES OF CLASSES HERE///////////////////////////////////////

function randomPoint() {
    let x = Math.random(); 
    let y = 1.0 - (x + (Math.random()-.5) / 2.0); //for demo, linear relationship with random error term. 
    return new Array(x, y); 
}

dataframe = document.createElement("div"); 
dataframe.id = "outerframe"; 
document.body.appendChild(dataframe); 


/////////////SCATTER PLOT HERE///////////////////////
var scatterplot = new jwSPlot(400, 200, 50, 50, "scatter_plot_example", "outerframe"); 

//populate scatter plot with random points. 
for (i = 0; i< 50; i++) {
    scatterplot.addpoint(...randomPoint()); 

}

//add a random point the the scatterplot every 500ms. 
setInterval(function(){scatterplot.addpoint(...randomPoint())}, 500); 
//////////////////////////////////////////////////////////////////

/////////////////////DISTRIBUTION HERE////////////////////////////
function binomialDist(n,p)  {
    let successes = 0; 
    for (let trial = 0; trial < n; trial++) {
        let result = Math.random(); 
        if (result < p) {
            successes +=1; 
        }
    }
    return successes; 
}

//initialize distribution with data from 10 iterations
//of 100 trials with .5 probability of success (ie, a random variable
//with distribution binomial(100, .5))
var initData = new Array(); 
for (i = 0; i<10; i++) {
    initData.push(binomialDist(100, .5)); 
}

console.log(initData); 
var test_distribution = new jwDistribution(400, 200, 50, 500, "distribution", "outerframe"); 

test_distribution.addData(initData);  
// test_distribution.addData([200]); 
//approximate the distribution with ten bins/bars
test_distribution.update_distribution(20);


//update the distribution with new data every 100ms 
setInterval(function(){test_distribution.addData([binomialDist(100, .5)]); test_distribution.update_distribution(20); console.log(test_distribution.getMoments())}, 1000); 

//////////////////////////////////////////////////////////////////


/////////////////////RUNNING LINE GRAPH HERE///////////////////////

///initialize line graph
var runningLineGraph = new jwRLGraph(850, 100, 300, 50, "running_line_example", "outerframe"); 

var counter = 0;

///feeding it data (for example, from a sine wave) every 100 ms
setInterval(function(){runningLineGraph.addData(.5*(Math.sin(counter)+1.0)); counter+=.1;}, 100); 
