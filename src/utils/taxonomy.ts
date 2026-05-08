import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export type TaxonomyTerm = {
	name: string;
	slug: string;
	count: number;
};

export function slugifyTerm(term: string) {
	return term
		.trim()
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&/g, ' and ')
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');
}

export function getCategoryHref(category: string) {
	return `/categories/${slugifyTerm(category)}/`;
}

export function getTagHref(tag: string) {
	return `/tags/${slugifyTerm(tag)}/`;
}

export function sortPostsByDate(posts: BlogPost[]) {
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getCategoryTerms(posts: BlogPost[]) {
	const terms = new Map<string, TaxonomyTerm>();

	for (const post of posts) {
		if (!post.data.category) continue;
		addTerm(terms, post.data.category);
	}

	return sortTerms(terms);
}

export function getTagTerms(posts: BlogPost[]) {
	const terms = new Map<string, TaxonomyTerm>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			addTerm(terms, tag);
		}
	}

	return sortTerms(terms);
}

export function findTermBySlug(terms: TaxonomyTerm[], slug: string) {
	return terms.find((term) => term.slug === slug);
}

export function mergeStaticTerm(terms: TaxonomyTerm[], name: string, count = 1) {
	const slug = slugifyTerm(name);
	const existing = terms.find((term) => term.slug === slug);

	if (existing) {
		existing.count += count;
		return terms;
	}

	return [...terms, { name, slug, count }].sort((a, b) => a.name.localeCompare(b.name));
}

function addTerm(terms: Map<string, TaxonomyTerm>, name: string) {
	const trimmedName = name.trim();
	if (!trimmedName) return;

	const slug = slugifyTerm(trimmedName);
	const existing = terms.get(slug);

	if (existing) {
		existing.count += 1;
		return;
	}

	terms.set(slug, {
		name: trimmedName,
		slug,
		count: 1,
	});
}

function sortTerms(terms: Map<string, TaxonomyTerm>) {
	return [...terms.values()].sort((a, b) => a.name.localeCompare(b.name));
}
