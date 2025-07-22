export function pluralize(word, count) {
	return count === 1 ? word : word + "s";
}

export function getOrdinalSuffix(i) {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
}

export function leaderboardEmoji(placement) {
	if (placement > 3) return "";
	return ["🥇", "🥈", "🥉"].at(placement - 1);
}

export function leaderboardText(placement) {
	if (placement > 3) return `${getOrdinalSuffix(placement)} Place`;
	return ["**1st Place!**", "**2nd Place!**", "**3rd Place!**"].at(
		placement - 1
	);
}

export function formatNumber(num) {
	return Math.abs(
		Math.min(Math.max(Math.round(num * 100) / 100, -100000), 100000)
	);
}
