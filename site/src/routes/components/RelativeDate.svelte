<script lang="ts">
	import dayjs, { extend } from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	extend(relativeTime);

	export let date: string;

	$: day = dayjs(date);

	$: relativeDate = day.fromNow(true);
	$: relativeDateNumber = day.diff(dayjs(), 'day');
	let colorClass = '';
	$: {
		if (relativeDateNumber > -7) {
			colorClass = 'text-green-500';
		} else if (relativeDateNumber > -30) {
			colorClass = 'text-blue-500';
		} else if (relativeDateNumber > -120) {
			colorClass = 'text-yellow-500';
		} else {
			colorClass = 'text-red-500';
		}
	}
</script>

<span class={colorClass}>{relativeDate}</span>
