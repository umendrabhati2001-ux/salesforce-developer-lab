String developerName = 'Umendra Bhati';
Date today = Date.today();

Account techCompany = new Account();
techCompany.Name = 'NexGen Cloud Systems';
techCompany.Industry = 'Technology';

System.debug('--- HELLO FROM VS CODE ---');
System.debug('Developer: ' + developerName);
System.debug('Date: ' + today);
System.debug('Company: ' + techCompany.Name + ' (' + techCompany.Industry + ')');
