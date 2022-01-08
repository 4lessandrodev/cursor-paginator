import { dataToNode } from '../../lib/core/data-to-node';

describe('data-to-node', () => {

	it('should transform a array to node', () => {
		const data = [{ id: '1' }, { id: '2' }];
		const nodes = dataToNode(data);

		expect(nodes).toEqual([
			{
				node: data[0],
				cursor: '1'
			},
			{
				node: data[1],
				cursor: '2'
			}
		]);

		expect(nodes).toHaveLength(2);
	});

	it('should transform a array to node', () => {
		const data = [];
		const nodes = dataToNode(data);
		expect(nodes).toEqual([]);

		expect(nodes).toHaveLength(0);
	});

})
