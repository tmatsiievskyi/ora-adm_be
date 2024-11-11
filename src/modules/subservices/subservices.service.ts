import { TFilterQuery, TSubservice } from '@common/types';
import { SubservoceRepo } from './subservices.repo';
import { TFindAllSubservicesInput } from './subservices.schema';
import { LocalizationRepo } from '../localization/localization.repo';

export class SubServiceService {
  private readonly subServiceRepo = new SubservoceRepo();
  private readonly localizationRepo = new LocalizationRepo();

  public async findAll(reqData: TFindAllSubservicesInput['query']) {
    const {
      search,
      page = '1',
      limit = '10',
      sortField = 'category',
      sortOder = 'asc',
      lng = 'uk-UA',
    } = reqData;

    let query: TFilterQuery<TSubservice> = {
      $nor: [
        { category: 'сonsultations' },
        { category: 'analyses' },
        { category: 'examination' },
      ],
    };
    if (search) {
      const localizations = await this.localizationRepo.find({
        lng,
        value: { $regex: search, $options: 'i' },
      });

      const keys = localizations.map((loc) => loc.key);
      query = {
        ...query,
        $or: [
          { label: { $in: keys } },
          { category: { $in: keys } },
          { searchTags: { $in: keys } },
        ],
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrd = sortOder === 'asc' ? 1 : -1;
    const sort: Record<any, any> = { category: 1, [sortField]: sortOrd };

    const { data, total } = await this.subServiceRepo.findWithOptions(query, {
      sort,
      skip,
      limit: parseInt(limit),
    });

    const categoryKeys = [...new Set(data.map((subs) => subs.category))];
    const groupedSubservices = categoryKeys.reduce(
      (acc, category) => {
        const categorySubservices = data.filter(
          (item) => item.category === category,
        );
        acc[category] = categorySubservices;
        return acc;
      },
      {} as Record<string, TSubservice[]>,
    );

    return { data: groupedSubservices, total };
  }
}
