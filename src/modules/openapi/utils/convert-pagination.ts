export const convertPageToOffset = (
	page: number,
	size: number,
): [number, number] => {
	const limit = size;
	const offset = page - 1 > 0 ? (page - 1) * size : 0;
	return [limit, offset];
};