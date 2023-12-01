module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/**/*.png");
    eleventyConfig.addPassthroughCopy("src/**/*.ico");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/site.webmanifest");

    return {
        dir: {
            input: "src",
            output: "public",
        }
    }
};