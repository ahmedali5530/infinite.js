/**
* Plugin for easy form submissions via ajax
* Author @ahmedali5530
***/
(function ( $ ) {
    $.fn.infinite = function(o,scb) {
		
		//merge the default options with given options
        var ifs = $.extend({
            show_button : false,
			url : '',
			per_page : 5,
			start_from : 0,
			append_to : $(this).selector,
			button_text : 'Load More Posts...',
			no_more_text : 'No More Posts to Show.',
        }, o );
		
		var button = '<button type="button" class="btn btn-default btn-block btn-lg" id="load-more">'+ifs.button_text+'</button>';
		
		var container = $(this).selector;
		
		if(ifs.url == ''){
			$.error('A url is required to use the Inifinite Plugin. Please pass it in object format.');
		}
		
		//initialize with the default
		var next_offset = $($(this).selector).attr('data-next-offset');
		if('undefined' === typeof next_offset){
			//set it here
			$($(this).selector).attr('data-next-offset',ifs.start_from + 1);
		}
		
		if(ifs.show_button == false){
			$(document).bind('scroll',function(e){
				e.preventDefault();
				//console.log('scrolling');
				//load the files when user reached at the end of document
				var nof = $(container).attr('data-next-offset');
				var btn = $(this);
				if('undefined' === typeof nof){
					//console.log('cannot generate the requrest');
				}else{
					if($(window).scrollTop() >= $(document).height() - $(window).height()){		
						//add the data-next-offset, data-prev-offset and data-last-row attr to container
						$.ajax({
							url : ifs.url,
							data : {limit: ifs.per_page,next_offset: nof},
							method : 'GET',
							dataType : 'json',
							contentType : 'application/x-www-form-urlencoded',
							processData : true,
							success : function(result){
								if(result.status == true){
									if('function' == typeof scb){
										scb(result);
									}else{
										$(ifs.append_to).append(result.data);
									}
									//set the next offset
									var next_off = parseInt(nof)+ifs.per_page;
									$(container).attr('data-next-offset',next_off);
									$(container).attr('data-prev-offset',result.prev_offset);
								}else{
									$(container).attr('data-next-offset',null);
									$(container).attr('data-prev-offset',result.prev_offset);
									//$(container).attr('disabled','disabled').text('No More Posts To Show').addClass('btn-warning');
									$(ifs.append_to).append('<div class="col-md-48 text-center bg-info">'+ifs.no_more_text+'</div>');
								}
							}
						});
					}
				}
			});
			
		}else{
			//show a button at the end of container to load the posts manually
			$(container).append(button);
			$(document).on('click','#load-more',function(e){
				e.preventDefault();
				//change the button text with spinner
				
				var nof = $(container).attr('data-next-offset');
				var btn = $(this);
				btn.attr('disabled','disabled').html('<i class="fa fa-spinner fa-spin fa-lg"></i>');
				if(typeof nof == 'undefined'){
					console.log('cannot generate the requrest');
				}else{
					$.ajax({
						url : ifs.url,
						data : {limit: ifs.per_page,next_offset: nof},
						method : 'GET',
						dataType : 'json',
						contentType : 'application/x-www-form-urlencoded',
						processData : true,
						success : function(result){
							if('function' == typeof scb){
								scb(result);
							}else{
								$(ifs.append_to).append(result.data);
							}
							btn.removeAttr('disabled').html(ifs.button_text);
							
							if(result.status == true){
							
								//$(ifs.append_to).append(result.rows);
								//set the next offset
								var next_off = parseInt(nof)+ifs.per_page;
								$(container).attr('data-next-offset',next_off);
								$(container).attr('data-prev-offset',result.prev_offset);
							}else{
								$(container).attr('data-next-offset',null);
								$(container).attr('data-prev-offset',result.prev_offset);
								btn.attr('disabled','disabled').text(ifs.no_more_text).addClass('btn-warning');
							}
						},
						error : function(xhr, textStatus, errorThrown){
							alert(textStatus);
						}
					});
				}
			});
		}
	};
}( jQuery ));

/****************plugin Ends***************/	
