export const MULTIMEDIA = {
	text: 'text',
	image: 'image',
	audio: 'audio',
	textToSpeech: 'text-to-speech',
	video: 'video'
};

export function setDefaultMedia(li) {
	if (li.type === MULTIMEDIA.image && (!li.data.startsWith('data:image') && !li.data.includes('/static/'))) {
		return {
			type: li.type,
			data: require(`./media/defaultExerciseThumbnail/images/${li.data}`)
		}
	} else if (li.type === MULTIMEDIA.audio && (!li.data.startsWith('data:audio') && !li.data.includes('/static/'))) {
		return {
			type: li.type,
			data: require(`./media/defaultExerciseThumbnail/sounds/${li.data}`)
		}
	} else if (li.type === MULTIMEDIA.video && (!li.data.startsWith('data:video') && !li.data.includes('/static/'))) {
		return {
			type: li.type,
			data: require(`./media/defaultExerciseThumbnail/videos/${li.data}`)
		}
	} else {
		return li;
	}
}