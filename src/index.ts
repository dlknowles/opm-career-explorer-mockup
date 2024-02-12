const path = window.location.pathname;
const pathSegments = path.split('/');
const fileName = pathSegments[pathSegments.length - 1];
console.log(fileName);

document.getElementById('menuToggle')?.addEventListener('click', function () {
    document.querySelector('.mockup-nav')?.classList.toggle('hidden');
});

if (fileName === 'intro.html') {
    const div1 = document.getElementById('div1');
    const div2 = document.getElementById('div2');
    const div3 = document.getElementById('div3');

    document.getElementById('showDiv1').addEventListener('click', function () {
        hideAllDivs();
        div1.style.display = 'block';
    });

    document.getElementById('showDiv2').addEventListener('click', function () {
        hideAllDivs();
        div2.style.display = 'block';
    });

    document.getElementById('showDiv3').addEventListener('click', function () {
        hideAllDivs();
        div3.style.display = 'block';
    });

    function hideAllDivs() {
        div1.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'none';
    }
}

if (fileName === 'results.html') {
    const urlField = document.querySelector('#urlField') as HTMLInputElement;
    const currentURL = window.location.href;
    console.log(currentURL);

    if (urlField && currentURL) {
        urlField.value = currentURL;
    }

    const copyButton = document.querySelector('#copyButton') as HTMLButtonElement;

    if (copyButton && currentURL) {
        copyButton.addEventListener('click', (event) => {
            event.preventDefault();
            navigator.clipboard
                .writeText(currentURL)
                .then(() => alert('URL copied to clipboard!'))
                .catch((err) => console.error('Error copying text: ', err));
        });
    }

    const staticSeriesData = './data/sample-series.json';
    fetchSeries(staticSeriesData);

    const matchRanges = [
        { min: 0, max: 79, color: 'red', copy: 'weak' },
        { min: 80, max: 89, color: 'orange', copy: 'moderate' },
        { min: 90, max: 95, color: 'lt-green', copy: 'strong' },
        { min: 96, max: 100, color: 'green', copy: 'very strong' }
    ];

    async function fetchSeries(staticSeriesData: any) {
        try {
            const res = await fetch(staticSeriesData);
            const data = await res.json();
            console.log(data);
            const seriesArr = data['Series'];
            seriesArr.sort((a: any, b: any) => {
                if (a.Match < b.Match) {
                    return 1;
                }
                if (a.Match > b.Match) {
                    return -1;
                }
                return 0;
            });
            console.log(seriesArr);

            const topSeriesList = document.querySelector('#top-series-list');
            if (topSeriesList) {
                const top10 = seriesArr.slice(0, 10);

                top10.forEach((series: any, i: number) => {
                    let html = `
                    <li>
                        <a href="#series-${i}" class="series-name" data-series-index="${i}">${series.CodeName}</a>
                    </li>
                    `;
                    topSeriesList.innerHTML += html;
                });

                topSeriesList.addEventListener('click', function (event) {
                    const targetElement = event.target as HTMLElement;
                    if (targetElement && targetElement.classList.contains('series-name')) {
                        event.preventDefault();

                        const seriesIndex = targetElement.getAttribute('data-series-index');
                        const scrollTargetElement = document.getElementById(`series-${seriesIndex}`);

                        if (scrollTargetElement) {
                            scrollTargetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }

            const seriesContainer = document.querySelector('#data');
            if (seriesContainer) {
                let currentIndex = 0;
                const displaySeries = () => {
                    for (let i = currentIndex; i < currentIndex + 10 && i < seriesArr.length; i++) {
                        const series = seriesArr[i];

                        // Get the match number for the series
                        let match = series.Match;
                        // Find the color range that match falls into
                        let matchRange = matchRanges.find((range) => match >= range.min && match <= range.max);
                        // Get the color class from the color range, or a default class if no range is found
                        let matchColor = matchRange ? matchRange.color : '';
                        let matchCopy = matchRange ? matchRange.copy : '';

                        let html = `
                        <div class="result" id="series-${i}">
                            <div class="grid-container">
                                <div class="series">
                                    <div class="series-detail">
                                        <h2><span class="series-name">${series.CodeName}</span></h2>
                                        <p class="match bg-blue">Based on your answers, your interests are a <strong class="match-color-${matchColor}">${matchCopy} match</strong> with this job series.</p>
                                        <p>${series.Description}</p>
                                        <div class="job-titles">
                                            <h3 class="text-xl">Example jobs</h3>
                                            <ul class="usa-list">
                                            ${series.JobTitles.map((job: any, i: number) => `<li>${job}</li>`).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="series-actions">
                                        <div class="usa-button-group">
                                            <a href="https://www.usajobs.gov/Search/Results?j=${series.Code}" class="usa-button icon"><svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
                                            <use xlink:href="assets/uswds/img/sprite.svg#search"></use>
                                        </svg> Search for jobs in this series</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        seriesContainer.innerHTML += html;
                    }
                    currentIndex += 10;
                };

                displaySeries();

                const loadMoreButton = document.querySelector('#load-more');
                if (loadMoreButton) {
                    loadMoreButton.addEventListener('click', () => {
                        //console.log(currentIndex);
                        displaySeries();
                        if (currentIndex >= seriesArr.length) {
                            loadMoreButton.remove();
                        }
                    });
                }
            }

            // Function to find the index of the element in the viewport
            function findCurrentIndex(results: any) {
                let minDistance = Number.MAX_SAFE_INTEGER;
                let closestIndex = 0;
                results.forEach((result: any, index: number) => {
                    let distance = Math.abs(result.getBoundingClientRect().top);
                    if (distance < minDistance) {
                        closestIndex = index;
                        minDistance = distance;
                    }
                });
                return closestIndex;
            }

            const prevButton = document.querySelector('#prev');
            if (prevButton) {
                prevButton.addEventListener('click', function () {
                    let results = document.querySelectorAll('.result');
                    let currentIndex = findCurrentIndex(results);

                    // Only decrement the index if it's not already at 0
                    if (currentIndex > 0) {
                        currentIndex--;
                        // Scroll to the new current element
                        results[currentIndex].scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }

            const nextButton = document.querySelector('#next');
            if (nextButton) {
                nextButton.addEventListener('click', function () {
                    let results = document.querySelectorAll('.result');
                    let currentIndex = findCurrentIndex(results);

                    // Only increment the index if it's not already at the last element
                    if (currentIndex < results.length - 1) {
                        currentIndex++;
                        // Scroll to the new current element
                        results[currentIndex].scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        const faqsSection = document.querySelector('.results-faqs-section') as HTMLElement;
        const accordion = document.querySelector('.faq-accordion') as HTMLElement;
        const full = document.querySelector('.faq-full') as HTMLElement;
        // Assuming you have a known previous sibling, adjust the selector accordingly.
        const prevSibling = faqsSection.previousElementSibling;

        if (prevSibling) {
            let observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        // Show the accordion when the previous sibling is out of view.
                        accordion.style.display = 'block';
                        full.style.display = 'none';
                    } else {
                        // Hide the accordion when the previous sibling is in view.
                        accordion.style.display = 'none';
                        full.style.display = 'block';
                    }
                });
            }, {
                root: null, // observing relative to the viewport
                threshold: 0.1, // Adjust threshold based on when you want the toggle to happen
            });

            observer.observe(prevSibling);
        }
    });
}

if (fileName === 'quiz.html') {
    const staticQuestionsData = './data/questions-v3.json';
    fetchQuestionsV3(staticQuestionsData);

    async function fetchQuestionsV3(staticQuestionsData: any) {
        try {
            const res = await fetch(staticQuestionsData);
            const data = await res.json();
            const questionsArr = data['questions'];
            const totalQuestions = questionsArr.length;

            const addRadioButtons = (n: number, fieldsetId: string) => {
                const labels = ['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'];
                const fieldset = document.querySelector('#' + fieldsetId);
                for (let i = 1; i <= n; i++) {
                    let html = `
                    <div class="selection" tabindex="0">
                        ${labels[i - 1]}
                    </div>
                    `;
                    if (fieldset) {
                        fieldset.innerHTML += html;
                    }
                }
            };

            const progressBar = document.querySelector('#progress-bar') as HTMLElement;
            const questionsContainer = document.querySelector('#quiz-container') as HTMLElement;

            if (questionsContainer) {
                // let startScreen = `
                //     <div class="question question-intro text-xl" data-question="0" tabindex="0">
                //         <div class="question-content submit-quiz">
                //             <h1 class="text-xl">USAJOBS Career Explorer</h1>
                //             <p>This tool will help you understand what jobs within the federal government might fit your interests. Read each question and determine how much you think you would like or dislike doing each activity.</p>
                //             <p>Don't think about whether you have the skills to do the activity or how much money you would make. Our goal is to allow you to explore careers in the federal government you might like or find rewarding.</p>
                //             <p><a href="#accessibility-help" class="usa-link helper-link" aria-controls="accessibility-help" data-open-modal>Additional accessibility help</a>
                //             <p><a class="usa-button selection text-xl" tabindex="0">Continue</a></p>
                //         </div>
                //     </div>
                // `;

                // questionsContainer.innerHTML += startScreen;

                questionsArr.forEach((question: any, i: number) => {
                    let fieldsetId = `rating${i}`;
                    let html = `
                        <div class="question text-xl" data-question="${i + 1}" tabindex="0">
                            <div class="question-content">
                                <h2 class="text-xl">
                                    <div class="question-number"><span class="sr-only">Question</span>${i + 1}</div><div class="question-text"><span class="question-number"><span class="sr-only">Question</span>${i + 1}. </span>How interested are you in doing these activities at work?</div>
                                </h2>
                                <p>${question.question}</p>
                                <div class="selections" id="${fieldsetId}"></div>
                            </div>
                        </div>
                        `;
                    questionsContainer.innerHTML += html;
                    addRadioButtons(5, fieldsetId);
                });

                let completeScreen = `
                    <div class="question question-submit text-xl" data-question="${totalQuestions + 1}" tabindex="0">
                        <div class="question-content submit-quiz">
                            <div>
                                <h2 class="text-2xl">Great! You've answered all the questions.</h2>
                                <a href="results.html" class="usa-button text-xl" id="submit">See your results</a>
                            </div>
                        </div>
                    </div>
                `;

                questionsContainer.innerHTML += completeScreen;

                let currentQuestion = 0;

                const handleSelection = (target: HTMLElement) => {
                    target.closest('.selections')?.querySelectorAll('.selection').forEach((selection) => {
                        selection.classList.remove('selected');
                    });
                    target.classList.add('selected');
                    console.log("selected");
                    const currentElement = target.closest('.question') as HTMLElement;
                    const currentQuestionNumber = Number(currentElement.dataset.question);

                    if (currentQuestionNumber === currentQuestion) {
                        currentQuestion++;
                        navigateToQuestion(currentQuestion);
                        updateProgress();
                    }
                };

                const navigateToQuestion = (questionNumber: number) => {
                    const targetElement = questionsContainer.querySelector(`.question[data-question="${questionNumber}"]`) as HTMLElement;
                    console.log(targetElement);
                    if (targetElement) {
                        targetElement.style.display = 'flex';
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            setTimeout(() => {
                                targetElement.focus();
                            }, 500);
                            if (questionNumber === 1) {
                                setTimeout(() => {
                                    (document.querySelector('.bar-bottom') as HTMLElement).style.display = 'block';
                                }, 300);
                            }
                        }, 300);
                    }
                };

                const updateProgress = () => {
                    // Update progress bar
                    const progressPercentage = ((currentQuestion - 1) / questionsArr.length) * 100;
                    progressBar.style.width = progressPercentage + '%';

                    // Update progress text
                    const progressTextElement = document.querySelector('#progress-text');
                    if (progressTextElement) {
                        progressTextElement.innerHTML = `<span class="pt-complete">${Math.floor(
                            progressPercentage
                        )}% Complete</span><span class="pt-answered">${currentQuestion - 1}/${totalQuestions} questions answered</span>`;
                        // progressTextElement.textContent = `${Math.floor(progressPercentage)}% Complete | ${currentQuestion - 1}/25 Answered`;
                    }
                };

                questionsContainer.addEventListener('click', function (event) {
                    const target = event.target as HTMLElement;
                    if (target.classList.contains('selection')) {
                        event.preventDefault();
                        handleSelection(target);
                    }
                });

                questionsContainer.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        const target = event.target as HTMLElement;
                        if (target.classList.contains('selection')) {
                            event.preventDefault();
                            handleSelection(target);
                        }
                    }
                });

                // Auto answer questions
                const autoAnswerButton = document.querySelector('#autoAnswer');
                if (autoAnswerButton) {
                    autoAnswerButton.addEventListener('click', function () {
                        for (let i = 0; i <= (totalQuestions); i++) {
                            const questionElement = questionsContainer.querySelector(`.question[data-question="${i}"]`) as HTMLElement;
                            if (questionElement) {
                                const selections = questionElement.querySelectorAll('.selection');
                                const targetSelection = selections[0]; // Select the first option for simplicity
                                if (targetSelection) {
                                    handleSelection(targetSelection as HTMLElement);
                                }
                            }
                        }
                    });
                }

                const submitButton = document.querySelector('#submit') as HTMLLinkElement;
                const loadingContainer = document.querySelector('.loading-container') as HTMLElement;
                const animation = document.querySelector('.loading-container > div') as HTMLElement;

                submitButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    const destination = this.href;
                    loadingContainer.style.display = 'flex';
                    setTimeout(() => {
                        animation.style.opacity = '0';
                    }, 3500);
                    // After 4 seconds, start the fade-out effect
                    setTimeout(() => {
                        loadingContainer.style.opacity = '0';
                        window.location.href = destination;
                    }, 4000);
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
