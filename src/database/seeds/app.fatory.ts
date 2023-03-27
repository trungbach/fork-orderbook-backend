import seedsClass = require('./index');

export default class AppSeedFactory {
    async run(nameSeedInput: string) {
        const factory = this.factory(nameSeedInput);
        if (!factory) {
            console.log('Seed not found');
            return;
        }
        return await factory.run();
    }

    /**
     * find seed name in folder seeds
     *
     * @param nameSeedInput 
     * @returns obj instance seeder
     */
    factory(nameSeedInput: string) {
        nameSeedInput = nameSeedInput.toLowerCase();
        for (var [className, classObj] of Object.entries(seedsClass)) {
            className = className.toLowerCase();
            if (className == nameSeedInput || className == nameSeedInput + 'seed') {
                return new classObj();
            }
        }
        return null;
    }
};
