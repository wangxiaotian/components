$(function(){
	function getpw(){return $(window).width();}
    function getph(){return $(window).height();}
    function setfontsize(){
        wiw=getpw();
        wih=getph();
        fz = (wiw/750);
        $('html').css('font-size', fz*100);

    }
    function loads(){
        setfontsize();
        $(window).on("resize",function(){
            setfontsize();
        })
    }
    loads();
})