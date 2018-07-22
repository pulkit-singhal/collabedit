var allocator = function() {
	this.boundary = 10;
	this.S = {};
}

allocator.prototype = {
    allocate: function(p, q) {
		let depth = 0;
		let interval = 0;
		while (interval < 1) {
			depth += 1;
			interval = this.availableIdentifiersBetween(this.prefix(p, depth), this.prefix(q, depth)) - 1;
		}
		let step = Math.min(this.boundary, interval);
		if (!(depth in this.S)) {
			let randomBoolean = Math.random() >= 0.5;
			this.S[depth] = randomBoolean;
		}
		let id;
		if (this.S[depth]) {
			let addVal = randInt(0, step) + 1;
			id = this.increaseIdentifier(this.prefix(p, depth), addVal);
		} else {
			let subVal = randInt(0, step) + 1;
			id = this.decreaseIdentifier(this.prefix(q, depth), subVal);
		}
		return id;
	},

	prefix: function(id, depth) {
		let idCopy = [];
		for (let cpt = 0; cpt < depth; cpt++) {
			if (cpt < id.length) {
				idCopy.push(id[cpt]);
			} else {
				idCopy.push(0);
			}
		}
		return idCopy;
	},

	increaseIdentifier: function(id, n) {
		let idCopy = id.slice(0);
		let depth = idCopy.length;
		let base = 32 * (2 ** (depth - 1))
		for(let i = depth - 1; i >= 0; --i) {
			idCopy[i] += n;
			n = Math.floor(idCopy[i] / base);
			idCopy[i] %= base;
			base /= 2;
		}
		return idCopy;
	},

	decreaseIdentifier: function(id, n) {
		let idCopy = id.slice(0);
		let depth = idCopy.length;
		let base = 32 * (2 ** (depth - 1))
		for(let i = depth - 1; i >= 0; --i) {
			let toDecrease = Math.floor(n / base);
			idCopy[i] -= (n % base);
			if (idCopy[i] < 0) {
				idCopy[i] += base;
				toDecrease += 1;
			}
			base /= 2;
			n = toDecrease;
		}
		return idCopy;
	},

	availableIdentifiersBetween: function(p, q) {
		let base = 32;
		let len = p.length;
		let intervalsToPut = 1;
		for(let level = 0; level < len; ++level) {
			intervalsToPut *= base;
			base *= 2;
		}
		base = 32;
		let intervals = 0;
		for(let i = 0; i < len; i++) {
			intervalsToPut /= base;
			base *= 2;
			intervals += (q[i] - p[i]) * intervalsToPut;
		}
		return intervals;
	}
}