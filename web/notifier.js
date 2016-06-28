var token = 'YOUR_TOKEN'; // TODO user settings
var languages = ['pt-br', 'en-us', 'zh-cn']; // TODO user settings
var schedule = later.parse.text('every 10 sec'); // TODO user settings

var getCertificationsUrl = 'https://review-api.udacity.com/api/v1/me/certifications.json';
var timer = later.setInterval(getCertifications, schedule);

function getCertifications(){
	$.ajax({
		method: 'GET',
		url: getCertificationsUrl,
		headers: {
			'authorization': token
		},
		success: function(certifications){
			printReviewsAwaiting(certifications);
		}
	});
}

function printReviewsAwaiting(certifications){
	var reviewsAwaiting = '';
	certifications.map(function(certification){
		if(certification.certified_at){ // Check if is certified (required to review projects)
			var projectName = certification.project.name;
			var languageReviewsCount = certification.project.awaiting_review_count_by_language;
			var reviewAwaiting = projectName + '\n';
			if(languageReviewsCount){
				languages.map(function(language){
					if(language in languageReviewsCount){
						reviewAwaiting += language + ': ' + languageReviewsCount[language] + '\n';
					}
				});
			}
			reviewsAwaiting += reviewAwaiting + '\n';
		}
	});
	console.log(reviewsAwaiting);
}

getCertifications();